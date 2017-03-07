import Memobird from './lib/index';
import { object } from './config';

export const param = {
  [object.memobirdID]: 'xxxxxxx',
  [object.ak]        : 'xxxxxxxxxxxxxxxxxxx'
};

const inst = new Memobird(param);

const strs = [
  {
    type : 'text',
    value: 'Hello, World!',
  },
  {
    type : 'pic',
    value: 'test/images/perlin.jpeg',
  },
  {
    type : 'pic_url',
    value: 'http://3.im.guokr.com/OYnNTiIv7BqE3mKECxYluSRBssRB7HUdfIAwF_QrhxwAAQAAAAEAAFBO.png',
  },
];

inst.setup()
  .then(z => z.print(strs))
  .then(() => console.log('print ok!'))
  .catch(inst.catchErr);
