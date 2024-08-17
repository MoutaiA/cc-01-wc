const { readFileSync } = require('fs');

const { argv } = process;

if (argv.length < 3) {
	console.log('No file provided');
	return;
}
const arguments = [];
for (let i = 2; i < argv.length; i++) {
	if (argv[i].includes('-')) {
		let s = argv[i].split('-');
		s = s.filter((a) => a !== '');
		arguments.push(...s);
	}
}

const fileArgument = argv[argv.length - 1];
const file = readFileSync(fileArgument);

const ARGUMENTS_MAPPING = {
	c: Buffer.byteLength,
};

let ans = '';
for (const arg of arguments) {
	ans += ARGUMENTS_MAPPING[arg](file);
}

console.log(ans);
