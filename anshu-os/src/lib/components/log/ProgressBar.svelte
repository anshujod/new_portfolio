<script lang="ts">
	// 1.5px reading-progress bar pinned under the nav.
	let progress = $state(0);

	function update() {
		const doc = document.documentElement;
		const max = doc.scrollHeight - doc.clientHeight;
		progress = max > 0 ? doc.scrollTop / max : 0;
	}
</script>

<svelte:window onscroll={update} onresize={update} />

<div
	class="fixed top-14 left-0 z-50 h-[1.5px] bg-signal transition-transform duration-75 ease-linear"
	style="width: 100%; transform: scaleX({progress}); transform-origin: left"
	aria-hidden="true"
></div>
