import React, { useState } from "react";
import appService from './services/service';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [cid, setCid] = useState('');
  const [error, setError] = useState('');

  const saveText = async () => {
    if (!text) {
      return;
    }
    setText('');
    setCid('');
    setError('');
    try {
      const data = await appService.saveText(text);
      setCid(data.data.cid);
    } catch {
      setError('oops. something went wrong');
    }
  }

  const clear = async () => {
    setText('');
    setCid('');
    setError('');
  }

  return (
    <div className="App">
      <div className="block">
        Save text to IPFS:
        <textarea
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <button
          onClick={saveText}
          className="button">
          Save
        </button>

        {cid && (
          <button
            onClick={clear}
            className="button">
            Clear
          </button>
        )}

        <div className={"text"}>
          { cid ? `Here is your saved CID: ${cid}` : null}
          { error ?? error}
        </div>

        {cid && (
          <div className="text">
            Check it out on IPFS
            {' '}
            <a target="_blank" href={`https://ipfs.io/ipfs/${cid}`}>HERE</a>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
