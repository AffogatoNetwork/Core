var Farmer = artifacts.require("./Farmer.sol");
var Coffee = artifacts.require("./Coffee.sol");

module.exports = function(deployer) {
  deployer.deploy(Coffee);
  deployer.deploy(Farmer);
};
