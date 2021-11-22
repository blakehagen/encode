import React, { useState } from "react";
import appService from './services/service';
import './App.css';

function App() {
  const [textToSave, setTextToSave] = useState('');
  const [cid, setCid] = useState('');
  const [cidToRetrieve, setCidToRetrieve] = useState('');
  const [retrievedText, setRetrievedText] = useState('');
  const [error, setError] = useState('');

  const saveText = async () => {
    if (!textToSave) {
      return;
    }
    setTextToSave('');
    setCid('');
    setError('');
    try {
      const data = await appService.saveText(textToSave);
      setCid(data.data.cid);
    } catch {
      setError('oops. something went wrong');
    }
  }

  const clear = async () => {
    setTextToSave('');
    setCid('');
    setError('');
    setCidToRetrieve('');
    setRetrievedText('');
  }
  
  const retrieveText = async () => {
    setError('');
    setRetrievedText('');
    setCidToRetrieve('');

    try {
      const data = await appService.retrieveText(cidToRetrieve);
      setRetrievedText(data.data.text);
    } catch {
      setError('oops. something went wrong');
    }
  }

  return (
    <div className="App">
      <div className="block">
        Save text to IPFS:
        <textarea
          onChange={(e) => setTextToSave(e.target.value)}
          value={textToSave}
          placeholder="Enter text to save to IPFS"
        />
        <button
          onClick={saveText}
          className="button">
          Save
        </button>

        <div className="text">
          { cid ? `Here is your saved CID: ${cid}` : null}
          { error ?? error}
        </div>

        {cid && (
          <div className="text">
            Check it out on IPFS
            {' '}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={`https://ipfs.io/ipfs/${cid}`}
            >
              HERE
            </a>
          </div>
        )}
      </div>

      <div className="block">
        Retrieve text from IPFS:
        <input
          onChange={(e) => setCidToRetrieve(e.target.value)}
          value={cidToRetrieve}
          placeholder="Enter CID from IPFS"
        />
        <button
          onClick={retrieveText}
          className="button">
          Retrieve
        </button>

        <div className="text">
          { retrievedText ? `Text returned: ${retrievedText}` : null}
          { error ?? error}
        </div>
      </div>

      <div>
        {(cid || retrievedText) && (
          <button
            onClick={clear}
            className="button-clear">
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
