var ActorFactory = artifacts.require("./ActorFactory.sol");
var FarmFactory = artifacts.require("./FarmFactory.sol");
var CoffeeBatchFactory = artifacts.require("./CoffeeBatchFactory.sol");
var TastingFactory = artifacts.require("./TastingFactory.sol");
var CertificateFactory = artifacts.require("./CertificateFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ActorFactory).then(async instance => {
    await deployer.deploy(TastingFactory, instance.address);
    await deployer.deploy(CertificateFactory, instance.address);
    await deployer.deploy(FarmFactory, instance.address);
    await deployer.deploy(CoffeeBatchFactory, instance.address);
  });
};
