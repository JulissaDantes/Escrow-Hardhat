require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.7.5",
  networks: {
    hardhat: {
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545"
    },
    rinkeby: {
      url:"https://rinkeby.infura.io/v3/433a74c66045425ba8fdf7f1cb23ffdb"
    },
    kovan: {
      url:"https://kovan.infura.io/v3/433a74c66045425ba8fdf7f1cb23ffdb"
    },
    ropsten:{
      url:"https://ropsten.infura.io/v3/433a74c66045425ba8fdf7f1cb23ffdb"
    }
  },
  paths: {
    artifacts: "./app/artifacts",
  }

};
