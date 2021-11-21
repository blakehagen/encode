const axios = require('axios').default;

export default {
  saveText(text) {
    return axios.post('/save-text', { text });
  }
}

