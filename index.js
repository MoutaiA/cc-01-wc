const { readFileSync } = require('fs');

const ARGUMENTS_MAPPING = {
	c: Buffer.byteLength,
	l: getLines,
};

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

const filename = argv[argv.length - 1];
const file = readFileSync(filename);

let ans = '';
for (const arg of arguments) {
	if (!(arg in ARGUMENTS_MAPPING)) {
		console.log(`ccwc: illegel option -- ${arg}`);
		continue;
	}
	ans += ARGUMENTS_MAPPING[arg](file);
}

console.log(`\t${ans} ${filename}`);

function getLines(file) {
	if (!file) {
		return 0;
	}
	return file.toString('utf8').split('\n').length -1
}
