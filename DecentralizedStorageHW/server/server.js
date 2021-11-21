const express = require('express');
const IPFS = require('ipfs');

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

app.post('/save-text', async (req, res) => {
  const { text } = req.body;
  try {
    const cid = await node.add(text);
    return res.status(200).json({ success: true, cid: cid.path })
  } catch {
    return res.status(400).send('oops. something went wrong.');
  }
})

app.listen(port, () => {
  console.log('Listening on port -->', port);
})