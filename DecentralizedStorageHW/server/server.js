const express = require('express');
const IPFS = require('ipfs');
const all = require('it-all');

const app = express();
const port = 3001;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

let node;

async function init() {
  node = await IPFS.create();
  console.log('IPFS node initialised.');
}

init();

app.get('/', (req, res) => {
  res.json({ message: "Hello from server!" });
})

app.post('/save', async (req, res) => {
  const { text } = req.body;
  try {
    const cid = await node.add(text);
    return res.status(200).json({ success: true, cid: cid.path })
  } catch {
    return res.status(400).send('oops. something went wrong.');
  }
})

app.get('/retrieve/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const data = Buffer.concat(await all(node.cat(cid)));
    return res.status(200).json({ success: true, text: data.toString() })
  } catch {
    return res.status(400).send('oops. something went wrong.');
  }
})

app.listen(port, () => {
  console.log('Listening on port -->', port);
})