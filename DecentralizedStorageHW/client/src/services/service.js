const axios = require('axios').default;

export default {
  saveText(text) {
    return axios.post('/save', { text });
  },
  retrieveText(cid) {
    return axios.get(`/retrieve/${cid}`);
  }
}
