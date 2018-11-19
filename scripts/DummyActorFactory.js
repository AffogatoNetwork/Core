//TODO: add faker for random names
var ActorFactory = artifacts.require("./ActorFactory.sol");

module.exports = function(callback) {
  // perform actions

  const run = async () => {
    console.log("Creating dummy actors");
    try {
      this.tokenInstance = await ActorFactory.deployed();
      var receipt = await this.tokenInstance.addActor(
        "Cristian Espinoza",
        "farmer",
        "Honduras",
        "Francisco Morazan",
        "ceegarner@gmail.com",
        { from: web3.eth.accounts[0] }
      );
      console.log("Dummy actor created:", receipt);

      receipt = await this.tokenInstance.addActor(
        "Robert Mudgett",
        "taster",
        "Honduras",
        "Francisco Morazan",
        "robert.mudgett@gmail.com",
        { from: web3.eth.accounts[1] }
      );
      console.log("Dummy actor created:", receipt);

      receipt = await this.tokenInstance.addActor(
        "Daniel Aguilar",
        "certifier",
        "Honduras",
        "Francisco Morazan",
        "cristian@startupreef.co",
        { from: web3.eth.accounts[2] }
      );
      console.log("Dummy actor created:", receipt);

      receipt = await this.tokenInstance.addActor(
        "Oscar Presidente",
        "taster",
        "Honduras",
        "Cortés",
        "oscar.rene1989@gmail.co",
        { from: web3.eth.accounts[3] }
      );
      console.log("Dummy actor created:", receipt);

      receipt = await this.tokenInstance.addActor(
        "Alejandra Hernández",
        "taster",
        "Honduras",
        "Francisco Morazan",
        "ceegarner@hotmail.com",
        { from: web3.eth.accounts[4] }
      );
      console.log("Dummy actor created:", receipt);
    } catch (e) {
      console.log(e);
    }
  };

  run();
};
