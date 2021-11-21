const IPFS = require('ipfs');
const all = require('it-all');

(async () => {
  const node = await IPFS.create();
  
  const cid = 'QmQTjCdKuF6W87Y1moM4vtpmtV53YwXfwuTHYEY3MwKCFL';
  
  const data = Buffer.concat(await all(node.cat(cid)));
  console.log('data.toString() -->', data.toString());
})();
