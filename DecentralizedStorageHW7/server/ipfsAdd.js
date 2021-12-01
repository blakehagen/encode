const IPFS = require('ipfs');

(async () => {
  const node = await IPFS.create();

  const data = 'Hello, Blake!';

  const cid = await node.add(data);
  
  console.log('cid.path -->', cid.path);
})();
