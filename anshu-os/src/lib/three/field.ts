import * as THREE from 'three';

// The ambient neural field — ~900 drifting points linked by proximity lines.
// Budget rules (blueprint §7): DPR ≤ 1.5, lines recomputed every 4th frame,
// loop paused when the tab is hidden, everything disposed on destroy.

const COUNT = 900;
const BOUNDS = { x: 340, y: 190, z: 90 };
const LINK_DIST = 26;
const MAX_LINKS = 1600;

export interface FieldHandle {
	destroy(): void;
}

const pointsVertex = /* glsl */ `
	uniform vec3 uMouse;
	varying float vGlow;

	void main() {
		vec4 mv = modelViewMatrix * vec4(position, 1.0);
		float d = distance(position.xy, uMouse.xy);
		vGlow = smoothstep(70.0, 8.0, d);
		gl_PointSize = (2.2 + vGlow * 2.4) * (170.0 / -mv.z);
		gl_Position = projectionMatrix * mv;
	}
`;

const pointsFragment = /* glsl */ `
	varying float vGlow;

	void main() {
		float a = smoothstep(0.5, 0.12, length(gl_PointCoord - 0.5));
		// hairline blue-grey at rest, signal blue near the cursor
		vec3 col = mix(vec3(0.32, 0.36, 0.55), vec3(0.30, 0.49, 1.0), vGlow);
		gl_FragColor = vec4(col, a * (0.4 + 0.6 * vGlow));
	}
`;

export function createField(canvas: HTMLCanvasElement): FieldHandle {
	const renderer = new THREE.WebGLRenderer({
		canvas,
		alpha: true,
		antialias: false,
		powerPreference: 'low-power'
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, 1, 1, 700);
	camera.position.z = 165;

	// --- points ---
	const positions = new Float32Array(COUNT * 3);
	const velocities = new Float32Array(COUNT * 3);
	for (let i = 0; i < COUNT; i++) {
		positions[i * 3] = (Math.random() - 0.5) * 2 * BOUNDS.x;
		positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOUNDS.y;
		positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * BOUNDS.z;
		velocities[i * 3] = (Math.random() - 0.5) * 0.05;
		velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
		velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
	}

	const pointsGeo = new THREE.BufferGeometry();
	pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	const pointsMat = new THREE.ShaderMaterial({
		uniforms: { uMouse: { value: new THREE.Vector3(9999, 9999, 0) } },
		vertexShader: pointsVertex,
		fragmentShader: pointsFragment,
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});
	const points = new THREE.Points(pointsGeo, pointsMat);
	points.frustumCulled = false;
	scene.add(points);

	// --- proximity lines ---
	const linePositions = new Float32Array(MAX_LINKS * 6);
	const linesGeo = new THREE.BufferGeometry();
	linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
	const linesMat = new THREE.LineBasicMaterial({
		color: 0x4d7cff,
		transparent: true,
		opacity: 0.14,
		blending: THREE.AdditiveBlending,
		depthWrite: false
	});
	const lines = new THREE.LineSegments(linesGeo, linesMat);
	lines.frustumCulled = false;
	scene.add(lines);

	// spatial hash so link-finding isn't O(n²)
	const cell = LINK_DIST;
	const grid = new Map<string, number[]>();
	const keyOf = (x: number, y: number, z: number) =>
		`${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;

	function rebuildLinks() {
		grid.clear();
		for (let i = 0; i < COUNT; i++) {
			const k = keyOf(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
			(grid.get(k) ?? grid.set(k, []).get(k)!).push(i);
		}

		let seg = 0;
		const maxDistSq = LINK_DIST * LINK_DIST;
		outer: for (let i = 0; i < COUNT; i++) {
			const x = positions[i * 3],
				y = positions[i * 3 + 1],
				z = positions[i * 3 + 2];
			const cx = Math.floor(x / cell),
				cy = Math.floor(y / cell),
				cz = Math.floor(z / cell);
			for (let dx = -1; dx <= 1; dx++)
				for (let dy = -1; dy <= 1; dy++)
					for (let dz = -1; dz <= 1; dz++) {
						const bucket = grid.get(`${cx + dx},${cy + dy},${cz + dz}`);
						if (!bucket) continue;
						for (const j of bucket) {
							if (j <= i) continue;
							const ddx = x - positions[j * 3],
								ddy = y - positions[j * 3 + 1],
								ddz = z - positions[j * 3 + 2];
							if (ddx * ddx + ddy * ddy + ddz * ddz < maxDistSq) {
								linePositions.set([x, y, z], seg * 6);
								linePositions.set(
									[positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]],
									seg * 6 + 3
								);
								if (++seg >= MAX_LINKS) break outer;
							}
						}
					}
		}
		linesGeo.setDrawRange(0, seg * 2);
		linesGeo.attributes.position.needsUpdate = true;
	}

	// --- pointer parallax + node glow ---
	const pointerNdc = new THREE.Vector2(0, 0);
	const mouseWorld = pointsMat.uniforms.uMouse.value as THREE.Vector3;

	function onPointerMove(e: PointerEvent) {
		pointerNdc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
		const v = new THREE.Vector3(pointerNdc.x, pointerNdc.y, 0.5).unproject(camera);
		const dir = v.sub(camera.position).normalize();
		const t = -camera.position.z / dir.z;
		mouseWorld.copy(camera.position).addScaledVector(dir, t);
	}
	window.addEventListener('pointermove', onPointerMove, { passive: true });

	// --- sizing ---
	function resize() {
		renderer.setSize(innerWidth, innerHeight, false);
		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();
	}
	resize();
	window.addEventListener('resize', resize);

	// --- loop ---
	let frame = 0;
	function tick() {
		for (let i = 0; i < COUNT * 3; i++) positions[i] += velocities[i];
		for (let i = 0; i < COUNT; i++) {
			for (const [axis, bound] of [
				[0, BOUNDS.x],
				[1, BOUNDS.y],
				[2, BOUNDS.z]
			] as const) {
				const idx = i * 3 + axis;
				if (positions[idx] > bound) positions[idx] = -bound;
				else if (positions[idx] < -bound) positions[idx] = bound;
			}
		}
		pointsGeo.attributes.position.needsUpdate = true;

		if (frame++ % 4 === 0) rebuildLinks();

		// gentle parallax toward the pointer
		camera.position.x += (pointerNdc.x * 10 - camera.position.x) * 0.03;
		camera.position.y += (pointerNdc.y * 6 - camera.position.y) * 0.03;
		camera.lookAt(0, 0, 0);

		renderer.render(scene, camera);
	}
	renderer.setAnimationLoop(tick);

	function onVisibility() {
		renderer.setAnimationLoop(document.hidden ? null : tick);
	}
	document.addEventListener('visibilitychange', onVisibility);

	return {
		destroy() {
			renderer.setAnimationLoop(null);
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('resize', resize);
			pointsGeo.dispose();
			linesGeo.dispose();
			pointsMat.dispose();
			linesMat.dispose();
			renderer.dispose();
		}
	};
}
