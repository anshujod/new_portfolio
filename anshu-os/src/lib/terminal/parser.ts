/** Tokenize a command line, respecting double-quoted strings. */
export function parse(input: string): { name: string; args: string[] } {
	const tokens: string[] = [];
	const re = /"([^"]*)"|(\S+)/g;
	let match;
	while ((match = re.exec(input)) !== null) {
		tokens.push(match[1] ?? match[2]);
	}
	const [name = '', ...args] = tokens;
	return { name: name.toLowerCase(), args };
}
