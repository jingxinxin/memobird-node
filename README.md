# memobird-node
 unofficial memobird node sdk

[![Build Status](http://img.shields.io/travis/jingxinxin/memobird-node.svg)](https://travis-ci.org/jingxinxin/memobird-node)

[![Npm Status](https://img.shields.io/npm/v/memobird-node.svg)](https://www.npmjs.com/package/memobird-node)


## Install
`$ npm i memobird-node`  or `$ yarn add memobird-node`

> If you need print picture, you should install [GraphicsMagick](http://www.graphicsmagick.org/)
>
> `$ brew install graphicsmagick`

## Usage

### Tiny Example
```javascript
import Memobirdfrom 'memobird-node';

const guguji = new Memobird{
  memobirdID: 'xxxxxxxxxxxx',
  ak: 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
});

guguji.setup()
  .then(guguji => guguji.print('hello, world!'))
  .catch(guguji.catchErr);
```

### Print Array && Image

```javascript
import Memobird from 'memobird-node';
import {param} from './example';// you must set the params first

const guguji = new Memobird(param);

const printArr = [
  { type: 'text',  value: 'Hello, Jack' },
  { type: 'pic',   value: 'images/test.png' },
  { type: 'pic_url', value: 'http://abc.xyz/images/xxx.png' },
];

guguji.setup()
  .then(() => guguji.print('Hello, World!'))
  .then(() => guguji.print(printArr))
  .then(() => console.log('all print task have done!'))
  .catch(gu.catchErr);
```

## Example
`$ npm run start`

## Test
`$ npm run test`

## TODO
* CLI version
* More feature

## License

MIT License

Copyright (c) 2017 Jack·S[www.51201314.me]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
