import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const assert = chai.assert;

import { param } from '../../example';
import Memobird from '../../lib/index';

describe('Memobird sdk', () => {
  const test  = new Memobird();
  const test1 = new Memobird(param);
  const test2 = new Memobird({ x: 1 });

  it('shoudle pass params', () => {
    assert.ok(typeof test.props === 'undefined');
    assert.ok(typeof test1.props === 'object');
  });

  it('should error when some key not pass', () => {
    assert.ok(Object.keys(test2).length === 0);
  });

  describe('#flatStrArray', () => {
    const printArr = [
      {
        type : 'text',
        value: 'Test 101'
      },
      {
        type : 'pic',
        value: 'test/images/perlin.jpeg'
      },
      {
        type : 'pic_url',
        value: 'http://3.im.guokr.com/OYnNTiIv7BqE3mKECxYluSRBssRB7HUdfIAwF_QrhxwAAQAAAAEAAFBO.png'
      },
    ];

    it('should return str join with | and have same length', () => {
      assert.ok(test1.flatStrArray(printArr).then(d => d.split('|').length === printArr.length));
    });
  });

  describe('#encodPic', () => {
    it('should reject none exist image', () => {
      assert.isRejected(test1.encodePic('xxx'));
    });
  });

  describe('#checkExist', () => {
    const obj = {
      a: 'x',
      b: 'y'
    };

    it('should return true, when all key exist', () => {
      assert.isTrue(test1.checkExist(obj, [ 'a', 'b' ]));
    });

    it('should return false, when some key not exist', () => {
      assert.isFalse(test1.checkExist(obj, [ 'x' ]));
    });
  });

  describe('#print', () => {
    it('should reject when empty str', () => {
      assert.isRejected(test1.print(''));
      assert.isRejected(test1.print());
    });
  });
});
