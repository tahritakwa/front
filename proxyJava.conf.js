const PROXY_CONFIG = {
  "/dev": {
    "target": " http://192.168.1.203:9002",
    "pathRewrite": {'^/dev/crmWs': '', '^/dev': '/api'},
    "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
      "localhost:4200/dev/crm": "http://192.168.1.203:9004",
      "localhost:4200/dev/crmWs": "http://192.168.1.203:9004",
      "localhost:4200/dev/mailing": "http://192.168.203:8895",
      "localhost:4200/dev/manufacturing": "http://localhost:8080",
      //"localhost:4200/dev/manufacturing": "http://192.168.1.133:7600",
      "localhost:4200/dev/accounting": "http://192.168.1.133:8844",
      "localhost:4200/dev/auth": "http://192.168.1.203:9007",
      //"localhost:4200/dev/auth": "http://localhost:8081",
      //"localhost:4200/dev": "http://192.168.1.203:9302",
      "localhost:4200": "http://192.168.1.203:9002"
    },
    "onProxyRes": function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
    }
  },
  "/rh-paie": {
  "target": "http://192.168.1.133:9801",
    "pathRewrite": {'^/rh-paie/dev': '/api'},
  "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
    "localhost:4200": "http://192.168.1.133:9801"
  },
  "onProxyRes": function (proxyRes) {
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
  }
},
  "/tmp": {
    "target": "http://192.168.1.153:2911",
    "pathRewrite": {'^/tmp': '/tmp'},
    "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
      "localhost:4200/api/manufacturing": "http://192.168.1.133:8834",
      "localhost:4200/api/accounting": "http://192.168.1.133:8844",
      "localhost:4200": "http://192.168.1.153:2911"
    },
    "onProxyRes": function (proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
    }
  }
};
module.exports = PROXY_CONFIG;
