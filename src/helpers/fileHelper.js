const {generateRandomString} = require('./commonHelper');
const fs = require('fs');
const path = require('path');
const {translation} = require('../models');

const promisifyUpload = (image,filePath) => {
    return new Promise((resolve, reject) => {
        image.mv(filePath, function (err) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};

let self = module.exports = {
    removeFile: (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            fs.rmSync(filePath, { recursive: true, force: true });
        }
    },
    removeDir: (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath, { recursive: true, force: true });
        }
    },
    mkDirByPathSync: (targetDir, {isRelativeToScript = false} = {}) => {
        const sep = path.sep;
        const initDir = path.isAbsolute(targetDir) ? sep : '';
        const baseDir = isRelativeToScript ? __dirname : '.';

        return targetDir.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(baseDir, parentDir, childDir);
            try {
                fs.mkdirSync(curDir);
            } catch (err) {
                if (err.code === 'EEXIST') { // curDir already exists!
                    return curDir;
                }

                // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
                if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
                    throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
                }

                const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
                if (!caughtErr || caughtErr && targetDir === curDir) {
                    throw err; // Throw if it's just the last created dir.
                }
            }

            return curDir;
        }, initDir);
    },
    uplaodFileToPath: async (req, rootDir = 'public/backend', absDir,inputName='image',renameFile=null) => {
        if (req.files && req.files[inputName]) {
            let dir = rootDir + absDir;
            self.mkDirByPathSync(dir);
            let image = req.files[inputName];
            let fileName = image.name;
            let fileNameSplit = fileName.split(".");
            let updatedName = "";
            let ext;
            for (let i = 0; i < fileNameSplit.length; i++) {
                let name = fileNameSplit[i];
                if (i == (fileNameSplit.length - 1)) {
                    ext = name;
                } else {
                    if (i == 0) {
                        updatedName = name;
                    } else {
                        updatedName = updatedName + "-" + name;
                    }
                }
            }
            fileName = updatedName + "-" + generateRandomString(5);
            fileName = fileName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + "." + ext;
            if(renameFile){
                fileName=renameFile;
            }
            // image.mv(dir + fileName, function (err) {
            //     if (err) {
            //         fileName = '';
            //     }
            // });
            await promisifyUpload(image,dir + fileName);
            fileName = absDir + fileName;
            return fileName;
        }
    },
    createFile: (path, absFileName, type, req,data=null) => {
        self.mkDirByPathSync(path);
        let fileName = path + absFileName + '.'+type;
        fs.writeFileSync(fileName, data);
        return true;
    },

    updateLanguageFile: async (req, filename, lang) => {
        fs.openSync(filename, 'w+');
        let data = await translation.findAll({where: {language: lang}, raw: true});
        fs.writeFileSync(filename, JSON.stringify(data));
        setTimeout(() => {
            req.session.translationdata = data; 
        }, 3000);
    }

};