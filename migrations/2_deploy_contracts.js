var ActorFactory = artifacts.require("./ActorFactory.sol");
var FarmFactory = artifacts.require("./FarmFactory.sol");
var CoffeeBatchFactory = artifacts.require("./CoffeeBatchFactory.sol");
var CupProfileFactory = artifacts.require("./CupProfileFactory.sol");
var CertificateFactory = artifacts.require("./CertificateFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ActorFactory).then(async actorInstance => {
    await deployer
      .deploy(FarmFactory, actorInstance.address)
      .then(async farmInstance => {
        await deployer
          .deploy(
            CoffeeBatchFactory,
            actorInstance.address,
            farmInstance.address
          )
          .then(async coffeeBatchInstance => {
            await deployer.deploy(CupProfileFactory, actorInstance.address);
            await deployer.deploy(
              CertificateFactory,
              actorInstance.address,
              coffeeBatchInstance.address
            );
          });
      });
  });
};
