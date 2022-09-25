const axios = require("axios");
var config = require("../config.json");

axios.interceptors.request.use(
  (conf) => {
    conf.headers["Authentication"] = `Token ${config["eat-sleep-nintendo-repeat-api"].api_key}`;
    return conf;
  },
  (error) => {
    Promise.reject(error);
  }
);

exports.axios = axios;
exports.baseURL = config["eat-sleep-nintendo-repeat-api"].base_url;
