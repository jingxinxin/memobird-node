import fs from 'fs';
// GraphicsMagick for node
import gm from 'gm';
// Bluebird is a full featured promise library with unmatched performance.
import Promise from 'bluebird';
// Convert character encodings in pure javascript.
import iconv from 'iconv-lite';
import rp from 'request-promise';
import _ from 'lodash';

import {
  URL,
  object as o
} from '../config';

/**
 * 姑姑机类
 */
class Memobird {
  constructor(props) {
    if (props === undefined) {
      console.error('ERR: undefined params');
      return;
    }

    /**
     * 检测参数是否有缺少
     * @type {[*]}
     */
    const keys = [ o.memobirdID, o.ak ];
    if (!this.checkExist(props, keys)) return;

    this.props  = props;
    this.userId = 0;
  }

  /**
   * 启动，开始关联
   * @returns {Promise.<Memobird>}
   */
  setup() {
    if (this.props === undefined) Promise.reject('param is undefined!');

    return this.connectAccount()
      .then(() => this)
      .catch(() => Promise.reject('can not binding your account'));
  }

  /**
   * 打印
   * @param str
   * @returns {*}
   */
  print(str) {
    if (typeof str === 'undefined' || str.length === 0) {
      return Promise.reject('print str can not be empty');
    }

    if (this.userId === 0)
      return Promise.reject('print fail, setup fail,can not get your showapi_userid');

    return Promise.resolve()
      .then(() => _.isArray(str) ? this.flatStrArray(str) : this.encode(str))
      .then(printcontent => this._request(o.print, { printcontent }))
      .then(res => {
        if (res.showapi_res_code === 1) {
          console.log(`printcontentid: ${res.printcontentid}`);
          return Promise.resolve(res);
        } else if (res.showapi_res_code === 0 && res.result === -3) {
          return Promise.reject('can not connect to memobird');
        }
        return Promise.reject(res);
      });
  }

  catchErr(e) {
    if (typeof e === 'string') console.error(`ERR: ${e}`);
    else if (typeof e.message !== 'undefined') console.error(`ERR: ${e.message}`);
    else console.error(JSON.stringify(e));
  }

  // private

  checkExist(obj, keys) {
    return keys.every(v => {
      const isExist = obj.hasOwnProperty(v);
      if (!isExist) console.error(`ERR: ${v} is undefined, please check`);
      return isExist;
    });
  }

  /**
   * 关联账号,获取userId
   * @returns {Promise.<TResult>|*}
   */
  connectAccount() {
    return this._request(o.connect)
      .then(res => {
        switch (res.showapi_res_code) {
          case 1:
            console.log('userId got success');
            this.userId = res.showapi_userid;
            break;
          case 0:
            console.log('userId got fail');
            Promise.reject(res.showapi_res_error);
            break;
          default:
            Promise.reject('connectAccount fail');
        }
      });
  }

  /**
   * 发送请求
   * @param type
   * @param params
   * @private
   */
  _request(type, params = {}) {
    const { ak, memobirdID } = this.props;

    const defaultParams = {
      ak,
      memobirdID,
      timestamp: Date.now(),
      userID   : this.userId,
      ...params
    };

    switch (type) {
      case o.connect:
        params = _.pick(defaultParams, [ o.ak, o.memobirdID, o.timestamp ]);
        break;
      case o.print:
        params = _.pick(defaultParams, [ o.ak, o.userID, o.printcontent, o.timestamp, o.memobirdID ]);
        break;
    }

    return rp({
      uri   : URL[ type ],
      method: 'post',
      json  : true,
      body  : params
    });
  }

  /**
   * 数组数据分析其中文字和图片
   * @param str
   * @returns {*}
   * @private
   */
  flatStrArray(str) {
    const deal = {
      [o.text]   : s => this.encode(s),
      [o.pic]    : p => this.encodePic(p),
      [o.pic_url]: url => rp({
        url,
        encoding: null
      }).then(res => this.encodePic(res))
    };

    //判断数组的数据格式是否正确
    if (str.some(val => deal[ val.type ] === undefined || val.value === undefined)) {
      return Promise.reject('array item shoule have prop :type && :value');
    }

    return Promise.all(_.map(
      str, item => deal[ item.type ](item.value)
    )).then(arr => arr.join('|'));
  }

  /**
   * 字符串转化到GBK，再编码到base64
   * @param str
   * @returns {string}
   * @private
   */
  encode(str) {
    return `T:${iconv.encode(`${str}\n`, 'gbk').toString('base64')}`;
  }

  /**
   * 读取图片，设置宽384，二值化，再编码到base64
   * @param image
   * @private
   */
  encodePic(image) {
    return new Promise((res, rej) => {
      if (typeof image === 'string') {
        try {
          fs.readFileSync(image);
        } catch (e) {
          rej(e);
        }
      }

      gm(image).resize(384).flip().type('Grayscale').colors(2).toBuffer('bmp', (err, buffer) => {
        if (err) rej(err);
        res(`P:${buffer.toString('base64')}`);
      });
    });
  }
}

export default Memobird;
