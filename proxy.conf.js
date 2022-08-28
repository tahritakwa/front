const PROXY_CONFIG = {
  "/dev": {
    "target": "http://localhost:5000",
    "pathRewrite": { '^/dev/crmWs': '', '^/dev': '/api' },
    "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
      "localhost:4201/dev/crm": "http://192.168.1.203:9004",
      "localhost:4201/dev/crmWs": "http://192.168.1.203:9004",
      "localhost:4201/dev/mailing": "http://192.168.1.203:8895",
      "localhost:4201/dev/manufacturing": "http://192.168.1.133:7600",
      "localhost:4201/dev/accounting": "http://192.168.1.133:8844",
      "localhost:4201/dev/auth": "http://localhost:8081",
      "localhost:4201": "http://localhost:5000"

    },
    "onProxyRes": function (proxyRes) {
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
    }
  },
  "/rh-paie": {
    "target": "http://localhost:5001",
    "pathRewrite": {'^/rh-paie/dev': '/api'},
    "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
      "localhost:4201": "http://localhost:5001"
    },
    "onProxyRes": function (proxyRes) {
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
    }
  },
  "/settings": {
    "target": "http://localhost:5002",
    "pathRewrite": {'^/settings/dev': '/api'},
    "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
      "localhost:4201": "http://localhost:5002"
    },
    "onProxyRes": function (proxyRes) {
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
    }
  },
  "/garage": {
    "target": "http://localhost:5005",
    "pathRewrite": {'^/garage/dev': '/api'},
    "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
      "localhost:4201": "http://localhost:5005"
    },
    "onProxyRes": function (proxyRes) {
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
    }
  },
  "/tmp": {
    "target": "http://localhost:5000",
    "pathRewrite": { '^/tmp': '/tmp' },
    "secure": false,
    "logLevel": "debug",
    "ws": true,
    "router": {
      "localhost:4200/api/manufacturing": "http://192.168.1.133:8834",
      "localhost:4200/api/accounting": "http://192.168.1.133:8833",
      "localhost:4200": "http://localhost:5000"
    },
    "onProxyRes": function (proxyRes) {
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization';
    }
  }
};
module.exports = PROXY_CONFIG;
