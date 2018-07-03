var Actor = artifacts.require("./Actor.sol");
var Coffee = artifacts.require("./Coffee.sol");

module.exports = function(deployer) {
  deployer.deploy(Actor);
  deployer.deploy(Coffee);
};
