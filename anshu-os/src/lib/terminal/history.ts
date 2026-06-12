/** Arrow-key command history with a draft slot for the in-progress line. */
export class History {
	private entries: string[] = [];
	private index = -1; // -1 means "at the draft"
	private draft = '';

	push(cmd: string) {
		if (cmd.trim() && this.entries[0] !== cmd) this.entries.unshift(cmd);
		this.index = -1;
		this.draft = '';
	}

	up(current: string): string {
		if (this.entries.length === 0) return current;
		if (this.index === -1) this.draft = current;
		this.index = Math.min(this.index + 1, this.entries.length - 1);
		return this.entries[this.index];
	}

	down(): string {
		if (this.index === -1) return this.draft;
		this.index -= 1;
		return this.index === -1 ? this.draft : this.entries[this.index];
	}
}
