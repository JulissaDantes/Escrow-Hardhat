require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.7.5",
  networks: {
    hardhat: {
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545"
    },
    rinkeby: {
      url: process.env.RINKEBY_URL
    },
    kovan: {
      url: process.env.KOVAN_URL
    },
    ropsten:{
      url: process.env.ROPSTEN_URL
    }
  },
  paths: {
    artifacts: "./app/artifacts",
  }

};
