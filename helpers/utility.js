const Joi = require('joi');
const crypto = require("crypto");
const fs = require('fs');
const path = require('path');
const db = require("../models");
const settings = db.settings;

var utility = {};

utility.randomString = (length) => {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


utility.generateToken = (length) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(length, function (err, buf) {
            if (err) {
                reject(err);
            } else {
                resolve(buf.toString('hex'))
            }
        });
    })

}

utility.generateCode = (prefix, type, length) => {
    return new Promise((resolve, reject) => {
        let lastID = 0;
        settings.findOne({
            where: {
                key: type
            }
        }).then(result => {
            result = JSON.parse(JSON.stringify(result));
            lastID = ((result && result.value) ? parseInt(result.value) : lastID) + 1;
            let str = prefix + (lastID).toString().padStart(length, '0');
            settings.update({ value: lastID }, { where: { key: type } })
            resolve(str);
        }).catch(error => {
            reject(error);
        })
    })
}

utility.fileupload = (claim_id, files) => {
    return new Promise(async (resolve, reject) => {
        let listKeys = Object.keys(files);
        let listFiles = [];
        var currentPath = process.cwd();
        var file_path = path.join(currentPath, '/public/images');
        StoreImages(0);
        async function StoreImages(i) {
            if (i < listKeys.length) {
                let name = await utility.randomString(5);
                var filedata = files[listKeys[i]].mv(file_path + '/' + name + files[listKeys[i]].name, (error, data) => {
                    if (error) {
                        reject(null);
                    } else {
                        listFiles.push({ claim_id: claim_id, documentName: listKeys[i], documentFile: name + files[listKeys[i]].name });
                        StoreImages(i + 1);
                    }
                })
            } else {
                resolve(listFiles);
            }
        }
    })
}

utility.imageupload = (files) => {
    return new Promise(async(resolve,reject)=>{
        let listKeys = Object.keys(files);
        let listFiles = [];
        var currentPath = process.cwd();
        var file_path = path.join(currentPath,'/public/images');
        StoreImages(0);
        async function StoreImages(i) {
            if(i < listKeys.length) {
                let name = await utility.randomString(5);
                var filedata = files[listKeys[i]].mv(file_path + '/' + name + files[listKeys[i]].name,(error,data)=>{
                    if(error){
                        reject(null);
                    }
                    else {
                        listFiles.push({service: listKeys[i],image: name + files[listKeys[i]].name});
                        StoreImages(i+1);
                    }
                })
                
            }else {
                resolve(listFiles);
            }
        }

    })
}

utility.uploadBase64Image = (imgBase64) => {

    return new Promise(async (resolve, reject) => {
        let name = await utility.randomString(12);
        let mimeType = imgBase64.match(/[^:/]\w+(?=;|,)/)[0];
        let filename = 'img_' + name + '.' + mimeType;
        var currentPath = process.cwd();
        var file_path = path.join(currentPath, '/public/images');


        // Remove header
        let base64Image = imgBase64.split(';base64,').pop();

        fs.writeFile(file_path + "/" + filename, base64Image, 'base64', function (err) {
            if (err) {
                reject(filename);
            }
        });
        resolve(filename);

    })

}


module.exports = utility;
