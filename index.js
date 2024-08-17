const { readFileSync } = require('fs');

const ARGUMENTS_MAPPING = {
	c: Buffer.byteLength,
	l: getLines,
	w: getWords,
	m: getCharacters,
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

if (ans) {
	console.log(`\t${ans} ${filename}`);
}

function getLines(file) {
	if (!file) {
		return 0;
	}
	return file.toString('utf8').split('\n').length - 1;
}

function getWords(file) {
	if (!file) {
		return 0;
	}

	file = file.toString('utf8').trim();

	if (file.length === 0) {
		return 0;
	}

	return file.split(/\s+/).filter((w) => w.length).length;
}

function getCharacters(file) {
	if (!file) {
		return 0;
	}

	let str = file.toString('utf8');
	str = str.normalize();

	const chars = Array.from(str);

	return chars.length;
}
