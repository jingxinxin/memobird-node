'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //GraphicsMagick for node
//Bluebird is a full featured promise library with unmatched performance.
//Convert character encodings in pure javascript.


var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _gm = require('gm');

var _gm2 = _interopRequireDefault(_gm);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _iconvLite = require('iconv-lite');

var _iconvLite2 = _interopRequireDefault(_iconvLite);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 姑姑机类
 */
var Memobird = function () {
  function Memobird(props) {
    _classCallCheck(this, Memobird);

    if (props === undefined) {
      console.error('ERR: undefined CONFIG');
      return;
    }

    /**
     * 检测参数是否有缺少
     * @type {[*]}
     */
    var keys = [_config.object.memobirdID, _config.object.ak];
    if (!this._checkExist(props, keys)) return;

    this.props = props;
    this.userId = 0;
  }

  /**
   * 启动，开始关联
   * @returns {Promise.<Memobird>}
   */


  _createClass(Memobird, [{
    key: 'setup',
    value: function setup() {
      var _this = this;

      if (this.props === undefined) _bluebird2.default.reject('param is undefined!');

      return this.connectAccount().then(function () {
        return _this;
      }).catch(function () {
        return _bluebird2.default.reject('can not binding your account');
      });
    }

    /**
     * 打印
     * @param str
     * @returns {*}
     */

  }, {
    key: 'print',
    value: function print(str) {
      var _this2 = this;

      if (typeof str === 'undefined' || str.length === 0) {
        return _bluebird2.default.reject('print str can not be empty');
      }

      if (this.userId === 0) return _bluebird2.default.reject('print fail, setup fail,can not get your showapi_userid');

      return _bluebird2.default.resolve().then(function () {
        return _lodash2.default.isArray(str) ? _this2.flatStrArray(str) : _this2._encode(str);
      }).then(function (printcontent) {
        return _this2._request(_config.object.print, { printcontent: printcontent });
      }).then(function (res) {

        if (res.showapi_res_code === 1) {
          console.log('printcontentid: ' + res.printcontentid);
          return _bluebird2.default.resolve(res);
        } else if (res.showapi_res_code === 0 && res.result === -3) {
          return _bluebird2.default.reject('can not connect to memobird');
        }
        return _bluebird2.default.reject(res);
      });
    }
  }, {
    key: 'catchErr',
    value: function catchErr(e) {
      if (typeof e === 'string') console.error('ERR: ' + e);else if (typeof e.message !== 'undefined') console.error('ERR: ' + e.message);else console.error(JSON.stringify(e));
    }

    // private

  }, {
    key: '_checkExist',
    value: function _checkExist(obj, keys) {
      return keys.every(function (v) {
        var isExist = obj.hasOwnProperty(v);
        if (!isExist) console.error('ERR: ' + v + ' is undefined, please check');
        return isExist;
      });
    }

    /**
     * 关联账号,获取userId
     * @returns {Promise.<TResult>|*}
     */

  }, {
    key: 'connectAccount',
    value: function connectAccount() {
      var _this3 = this;

      return this._request(_config.object.connect).then(function (res) {
        console.log(res);
        switch (res.showapi_res_code) {
          case 1:
            console.log('userId got success');
            _this3.userId = res.showapi_userid;
            break;
          case 0:
            console.log('userId got fail');
            _bluebird2.default.reject(res.showapi_res_error);
            break;
          default:
            _bluebird2.default.reject('connectAccount fail');
        }
      });
    }

    /**
     * 发送请求
     * @param type
     * @param params
     * @private
     */

  }, {
    key: '_request',
    value: function _request(type) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _props = this.props,
          ak = _props.ak,
          memobirdID = _props.memobirdID;


      var defaultParams = _extends({
        ak: ak,
        memobirdID: memobirdID,
        timestamp: Date.now(),
        userID: this.userId
      }, params);

      switch (type) {
        case _config.object.connect:
          params = _lodash2.default.pick(defaultParams, [_config.object.ak, _config.object.memobirdID, _config.object.timestamp]);
          break;
        case _config.object.print:
          params = _lodash2.default.pick(defaultParams, [_config.object.ak, _config.object.userID, _config.object.printcontent, _config.object.timestamp, _config.object.memobirdID]);
          break;
      }

      return (0, _requestPromise2.default)({
        uri: _config.URL[type],
        method: 'post',
        json: true,
        body: params
      });
    }

    /**
     * 数组数据分析其中文字和图片
     * @param str
     * @returns {*}
     * @private
     */

  }, {
    key: 'flatStrArray',
    value: function flatStrArray(str) {
      var _this4 = this,
          _deal;

      var deal = (_deal = {}, _defineProperty(_deal, _config.object.text, function (s) {
        return _this4._encode(s);
      }), _defineProperty(_deal, _config.object.pic, function (p) {
        return _this4._encodePic(p);
      }), _defineProperty(_deal, _config.object.pic_url, function (url) {
        return (0, _requestPromise2.default)({
          url: url,
          encoding: null
        }).then(function (res) {
          return _this4._encodePic(res);
        });
      }), _deal);

      //判断数组的数据格式是否正确
      if (str.some(function (val) {
        return deal[val.type] === undefined || val.value === undefined;
      })) {
        return _bluebird2.default.reject('array item shoule have prop :type && :value');
      }

      return _bluebird2.default.all(_lodash2.default.map(str, function (item) {
        return deal[item.type](item.value);
      })).then(function (arr) {
        return arr.join('|');
      });
    }

    /**
     * 字符串转化到GBK，再编码到base64
     * @param str
     * @returns {string}
     * @private
     */

  }, {
    key: '_encode',
    value: function _encode(str) {
      return 'T:' + _iconvLite2.default.encode(str + '\n', 'gbk').toString('base64');
    }

    /**
     * 读取图片，设置宽384，二值化，再编码到base64
     * @param image
     * @private
     */

  }, {
    key: '_encodePic',
    value: function _encodePic(image) {
      return new _bluebird2.default(function (res, rej) {
        if (typeof image === 'string') {
          try {
            _fs2.default.readFileSync(image);
          } catch (e) {
            rej(e);
          }
        }

        (0, _gm2.default)(image).resize(384).flip().type('Grayscale').colors(2).toBuffer('bmp', function (err, buffer) {
          if (err) rej(err);
          res('P:' + buffer.toString('base64'));
        });
      });
    }
  }]);

  return Memobird;
}();

exports.default = Memobird;
