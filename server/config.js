module.exports = {
  "restApiRoot": "/api",
  "host": process.env.HOST | "127.0.0.1",
  "port": process.env.PORT || 3000,
  "remoting": {
    "context": false,
    "rest": {
      "handleErrors": false,
      "normalizeHttpPath": false,
      "xml": false
    },
    "json": {
      "strict": true,
      "limit": "100kb"
    },
    "urlencoded": {
      "extended": false
    },
    "cors": false
  }
};
