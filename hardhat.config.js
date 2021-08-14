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
      url: RINKEBY_URL
    },
    kovan: {
      url: KOVAN_URL
    },
    ropsten:{
      url: ROPSTEN_URL
    }
  },
  paths: {
    artifacts: "./app/artifacts",
  }

};
