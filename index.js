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
		const filesFromArgs = [];
		for (let i = 2; i < argv.length; i++) {
			if (argv[i].includes('-')) {
				let s = argv[i].split('-');
				s = s.filter((a) => a !== '');
				arguments.push(...s);
			} else {
				filesFromArgs.push(i);
			}
		}
		const files = [];
		for (const i of filesFromArgs) {
			const filename = argv[i];
			let file = readFileSync(filename);
			file = file.toString('utf8');
			files.push({ file, filename });
		}

		return {
			files,
			arguments,
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
		return { files: [{ file: await readFile() }] };
	}
}

async function main() {
	// TODO: multiple files & multiple args
	let { files, arguments = [] } = await getInputData();
	let ans = '';

	for (const file of files) {
		for (const arg of arguments) {
			if (!(arg in ARGUMENTS_MAPPING)) {
				console.log(`ccwc: illegel option -- ${arg}`);
				continue;
			}

			ans += ARGUMENTS_MAPPING[arg](file);
		}
		if (ans) {
			ans += '\n';
		}
	}

	if (!arguments || arguments.length === 0) {
		let totalLines = 0;
		let totalWords = 0;
		let totalCharacters = 0;
		for (const cur of files) {
			const { file, filename = '' } = cur;
			const lines = ARGUMENTS_MAPPING['l'](file);
			const words = ARGUMENTS_MAPPING['w'](file);
			const chars = ARGUMENTS_MAPPING['m'](file);
			totalLines += lines;
			totalWords += words;
			totalCharacters += chars;
			ans += `${lines}\t${words}\t${chars}\t${filename}\n`;
		}
		ans += `${totalLines}\t${totalWords}\t${totalCharacters}`
	}

	if (ans) {
		console.log(`\r${ans}`);
	}
	process.exit();
}

main();
