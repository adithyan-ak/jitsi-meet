/* eslint-disable */

const fs = require('fs');
const process = require('process');
const path = require('path');
const traverse = require('traverse');
const mainLang = require('./main.json');

const [ targetLangFile ] = process.argv.slice(-1);

if (!targetLangFile) {
    console.log('No target language file specified');
    process.exit(1);
}

const baseDir = path.resolve(__dirname);
const targetPath = path.resolve(baseDir, targetLangFile);

// Ensure the targetLangFile is inside the current directory
if (!targetPath.startsWith(baseDir + path.sep)) {
    console.log('Invalid target language file path');
    process.exit(1);
}

const targetLang = require(targetPath);

const paths = traverse(mainLang).reduce(function(acc, item) {
    if (this.isLeaf) {
        acc.push(this.path);
    }

    return acc;
}, []);

const result = {};

for (const pathArr of paths) {
    if (traverse(targetLang).has(pathArr)) {
        traverse(result).set(pathArr, traverse(targetLang).get(pathArr));
    } else {
        //console.log(`${pathArr.join('.')} is missing`);
        traverse(result).set(pathArr, '');
    }
}

const data = JSON.stringify(result, undefined, 4);

fs.writeFileSync(targetPath, data);
