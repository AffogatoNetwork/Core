var ActorFactory = artifacts.require("./ActorFactory.sol");
var FarmFactory = artifacts.require("./FarmFactory.sol");
var Coffee = artifacts.require("./Coffee.sol");
var TastingFactory = artifacts.require("./TastingFactory.sol");
var CertificateFactory = artifacts.require("./CertificateFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ActorFactory).then(instance => {
    deployer.deploy(TastingFactory, instance.address);
    deployer.deploy(CertificateFactory, instance.address);
  });
  deployer.deploy(FarmFactory);
  deployer.deploy(Coffee);
};
