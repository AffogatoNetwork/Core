require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider-privkey");
var pkey =  process.env.TESTING_PKEY;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    /*rinkeby: {
      host: "127.0.0.1", // Connect to geth on the specified
      port: 8545,
      from: "0x5786e4d14e9027395146c4301c8af60963b66819", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },*/
    "rinkeby-infura": {
      provider: () => new HDWalletProvider(pkey, "https://rinkeby.infura.io/"+ process.env.INFURA_KEY),
      network_id: 4,
      gas: 4700000
    }
  }
};
