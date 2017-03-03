const request = require('request');
const iconv   = require('iconv-lite');

const content = `我想你`;

const contentGBK = iconv.encode(content, 'GBK');

// const contentBase64 = `T:${toGBK(stringToBase64(contentGBK))}`;

const url = 'http://open.memobird.cn/home/';

// request.post(url + 'printpaper').form({
//   ak          : '4597d73c125644faa1a5b8936c742b0c',
//   timestamp   : Date.now(),
//   memobirdID  : 'bc73a9e31435d4e7',
//   userID      : '224132',
//   printcontent: contentBase64
// });

// function toGBK(content) {
//   return iconv.encode(content, 'GBK');
// }
//
// function base64ToString(base64) {
//   return new Buffer(base64, 'base64').toString()
// }
//
// function stringToBase64(str) {
//   return new Buffer(str).toString('base64');
// }

var http = require('http'),
    fs   = require('fs'),
    gm   = require('gm');

// fs.readFile('./avatar.png', 'binary', function (err, file) {
//   if (err) {
//     console.log(err);
//     return;
//   } else {
//     http.createServer(function (req, res) {
//       res.writeHead(200, { 'Content-Type': 'image/jpeg' });
//       res.write(file, 'binary');
//       res.end();
//       return;
//     }).listen(8888);
//   }
// });
var buf = require('fs').readFileSync('./avatar.png');

// gm(buf, 'image.jpg')
//   .resize(240,240);


// gm('./avatar.png')
//   .resize(100, 100)
//   .toBuffer('PNG',function (err, buffer) {
//     if (err) return handle(err);
//     console.log(
//       `P:${base64_encode(buffer)}`
//     );
//
//     request.post(url + 'printpaper').form({
//       ak          : '4597d73c125644faa1a5b8936c742b0c',
//       timestamp   : Date.now(),
//       memobirdID  : 'b101495c73a9e31435d4e7',
//       userID      : '224132',
//       printcontent: `P:${base64_encode(buffer)}`
//     });
//   })

fs.readFile('./avatar1.png', 'binary', function (err, file) {
  if (err) {
    console.log(err);
    return;
  } else {

    // const a = gm(file).resize(240,240);


    // console.log(
    //   `P:${base64_encode(file)}`
    // );

    // request.post(url + 'printpaper').form({
    //   ak          : '4597d73c125644faa1a5b8936c742b0c',
    //   timestamp   : Date.now(),
    //   memobirdID  : 'bc73a9e31435d4e7',
    //   userID      : '224132',
    //   printcontent: `P:${base64_encode(file)}`
    // });
  }
});

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  // var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(file).toString('base64');
}

// function to create file from base64 encoded string
function base64_decode(base64str, file) {
  // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
  var bitmap = new Buffer(base64str, 'base64');
  // write buffer to file
  fs.writeFileSync(file, bitmap);
  console.log('******** File created from base64 encoded string ********');
}

