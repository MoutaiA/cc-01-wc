const { readFileSync } = require('fs');

const ARGUMENTS_MAPPING = {
	c: Buffer.byteLength,
	l: getLines,
	w: getWords,
	m: getCharacters,
};

function getLines(file) {
	if (!file) {
		return 0;
	}
	return file.split('\n').length - 1;
}

function getWords(file) {
	if (!file) {
		return 0;
	}

	file = file.trim();

	if (file.length === 0) {
		return 0;
	}

	return file.split(/\s+/).filter((w) => w.length).length;
}

function getCharacters(file) {
	if (!file) {
		return 0;
	}

	const str = file.normalize();

	const chars = Array.from(str);

	return chars.length;
}

async function getInputData() {
	if (process.stdin.isTTY) {
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
		let file = readFileSync(filename);
		file = file.toString('utf8');

		return {
			file,
			arguments,
			filename,
		};
	} else {
		process.stdin.setEncoding('utf8');
		let inputData = '';

		const readFile = () =>
			new Promise((resolve) => {
				process.stdin.on('data', (chunk) => {
					inputData += chunk;
				});

				process.stdin.on('end', () => {
					resolve(inputData);
				});
			});
		return { file: await readFile() };
	}
}

async function main() {
	let { file, filename = '', arguments = [] } = await getInputData();
	let ans = '';

	for (const arg of arguments) {
		if (!(arg in ARGUMENTS_MAPPING)) {
			console.log(`ccwc: illegel option -- ${arg}`);
			continue;
		}
		ans += ARGUMENTS_MAPPING[arg](file);
	}

	if (!arguments || arguments.length === 0) {
		ans = `${ARGUMENTS_MAPPING['l'](file)}\t${ARGUMENTS_MAPPING['w'](file)}\t${ARGUMENTS_MAPPING['m'](file)}`;
	}

	if (ans) {
		console.log(`\t${ans} ${filename}`);
	}
	process.exit();
}

main();
