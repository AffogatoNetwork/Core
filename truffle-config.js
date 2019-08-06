require("dotenv").config(); // Store environment-specific variable from '.env' to process.env
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = process.env.MNENOMIC;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: "0.5.9" // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(mnemonic, process.env.RINKEBY_API_URL),
      network_id: "4"
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(mnemonic, process.env.ROPSTEN_API_URL),
      network_id: "3",
      skipDryRun: true
    }
  },
  plugins: ["truffle-security"]
};
