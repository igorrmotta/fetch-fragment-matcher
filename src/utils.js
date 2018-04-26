const path = require('path');
const fs = require('fs');

module.exports.createDirRecursively = (dir) => {
    dir
        .split(path.sep)
        .reduce((currentPath, folder) => {
            currentPath += folder + path.sep;
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
            return currentPath;
        }, '');
};

function klawSync(dirPath, filterRegex, fileNames) {
    if (!fileNames) {
        fileNames = [];
    }
    const fileStat = fs.statSync(dirPath);
    if (fileStat.isDirectory()) {
        const directory = fs.readdirSync(dirPath);
        directory.forEach((f) => klawSync(path.join(dirPath, f), filterRegex, fileNames));
    } else if (filterRegex.test(dirPath)) {
        fileNames.push(dirPath);
    }
    return fileNames;
}
module.exports.klawSync = klawSync;

module.exports.writeFile = (result, file) => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = result.__schema.types.filter(
        type => type.possibleTypes !== null
    );

    result.__schema.types = filteredData;

    fs.writeFileSync(
        file,
        JSON.stringify(result),
        (err) => { if (err) throw err; }
    );
};