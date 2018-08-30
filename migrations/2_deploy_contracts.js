var ActorFactory = artifacts.require("./ActorFactory.sol");
//var Farmer = artifacts.require("./Farmer.sol");
//var Coffee = artifacts.require("./Coffee.sol");
//var Taster = artifacts.require("./Taster.sol");

module.exports = function(deployer) {
  deployer.deploy(ActorFactory);
  //  deployer.deploy(Coffee);
  //  deployer.deploy(Farmer);
  //  deployer.deploy(Taster);
};
