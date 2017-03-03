const Gugu =require('gugu-node');

const gu = new Gugu({
  useridentifying: '224132',
  memobirdID: 'bc73a9e31435d4e7',
  ak: '4597d73c125644faa1a5b8936c742b0c',
});



gu.setup()
  .then(gu => gu.print('hello, world!'))
  .catch(gu.catchErr);