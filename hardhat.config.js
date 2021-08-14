require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.7.5",
  networks: {
    hardhat: {
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545"
    }
  },
  paths: {
    artifacts: "./app/artifacts",
  }

};
