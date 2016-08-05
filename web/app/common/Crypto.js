/**
 * Created by Leo on 16/8/2.
 */
var crypto = require('crypto');


module.exports.passwordCrypto = function(orginPassword){
    const suppotHashes = crypto.getHashes();
    if(!suppotHashes || suppotHashes.length < 1){
      throw new Error('该平台无支持加密的hash算法');
    }
    //使用的加密算法,首选sha256,没有则MD5,再没有则getHashed()返回的第一个
    var algorithm = null;
    if(suppotHashes.indexOf('md5') !== -1){
      algorithm = 'md5';
    }
    if(suppotHashes.indexOf('sha256') !== -1){
      algorithm = 'sha256';
    }
    if(!algorithm){
      algorithm = suppotHashes[0];
    }

    var shasum = crypto.createHash(algorithm);
    shasum.update(orginPassword);
    return shasum.digest('hex');
};
