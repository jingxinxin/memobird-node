'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _URL;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var object = exports.object = {
  connect: 'connect',
  print: 'print',
  ak: 'ak',
  memobirdID: 'memobirdID',
  timestamp: 'timestamp',
  text: 'text',
  pic: 'pic',
  pic_url: 'pic_url',
  printcontent: 'printcontent',
  userID: 'userID'
};

var URL = exports.URL = (_URL = {}, _defineProperty(_URL, object.connect, 'http://open.memobird.cn/home/setuserbind'), _defineProperty(_URL, object.print, 'http://open.memobird.cn/home/printpaper'), _URL);