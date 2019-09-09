// /**
//  * Blog Refs:
//  * https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e
//  *https://www.reddit.com/r/javascript/comments/8doo5t/lets_encrypt_files_with_node/

//  *  https://stackoverflow.com/questions/27345839/node-js-encrypts-large-file-using-aes
//  * 
//  */
// const zlib = require('zlib');
// const fs = require('fs');

// // const hash = crypto.createHash('sha256');
// // hash.update('mySup3rC00lP4ssWord');  // user input or from server??
// // const KEY = hash.digest();



// function getCipherKey(password) {
//     return crypto.createHash('sha256').update(password).digest();
//   }

//   const Key = getCipherKey('mySup3rC00lP4ssWord');
// console.log(Key,"L23>>");
// // multi part processing << ad  multer for image , other file processing


// /*


// // readStream.on('data', (chunk) =>{
// //   console.log(chunk.toString('utf8'));
// // });
// */
// const readStream = fs.createReadStream('./file.txt'); //file handling here
// const gzipStream = zlib.createGzip();
// const writeStream = fs.createWriteStream('./newfile.txt');


// readStream.pipe(gzipStream).pipe(writeStream);




const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const AppendInitVect = require('./appendInitVect');
const getCipherKey = require('./getCipherKey');

function encrypt({ file, password }) {
  // Generate a secure, pseudo random initialization vector.
  const initVect = crypto.randomBytes(16);
  
  // Generate a cipher key from the password.
  const CIPHER_KEY = getCipherKey(password);
  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  // Create a write stream with a different file extension.
  const writeStream = fs.createWriteStream(path.join(file + ".enc"));
  
  readStream
    .pipe(gzip)
    .pipe(cipher)
    .pipe(appendInitVect)
    .pipe(writeStream);
}

encrypt({ file: './video.mp4', password: 'TestPassword' });
