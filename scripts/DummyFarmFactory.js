//TODO: add faker for random names
var FarmFactory = artifacts.require("./FarmFactory.sol");

module.exports = function(callback) {
  // perform actions

  const run = async () => {
    console.log("Creating dummy actors");
    try {
      this.tokenInstance = await FarmFactory.deployed();
      var receipt = await this.tokenInstance.addFarm(
        "Los Encinos",
        "Honduras",
        "Francisco Morazan",
        "Santa Lucia",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: web3.eth.accounts[0] }
      );
      console.log("Dummy farm created:", receipt);

      receipt = await this.tokenInstance.addFarm(
        "Cual Tricicleta",
        "Honduras",
        "La Paz",
        "Marcala",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: web3.eth.accounts[0] }
      );
      console.log("Dummy farm created:", receipt);

      receipt = await this.tokenInstance.addFarm(
        "La Primavera",
        "Honduras",
        "Cortés",
        "San Pedro Sula",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: web3.eth.accounts[0] }
      );
      console.log("Dummy farm created:", receipt);
    } catch (e) {
      console.log(e);
    }
  };

  run();
};
