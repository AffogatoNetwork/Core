require("chai").should();
require("chai").expect;

var FarmFactory = artifacts.require("./FarmFactory.sol");

contract(FarmFactory, function(accounts) {
  function byteToString(a) {
    return trimNull(web3.toUtf8(a));
  }
  function trimNull(a) {
    var c = a.indexOf("\0");
    if (c > -1) {
      return a.substr(0, c);
    }
    return a;
  }

  beforeEach(async () => {
    this.tokenInstance = await FarmFactory.deployed();
  });

  describe("Farm Validations", () => {
    it("Adds a farm", async () => {
      const receipt = await this.tokenInstance.addFarm(
        "Los Encinos",
        "Honduras",
        "Francisco Morazan",
        "Santa Lucia",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: accounts[0] }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddFarm",
        "should be the LogAddFarm event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "logs the added farm id"
      );
      receipt.logs[0].args._ownerAddress.should.be.equal(
        accounts[0],
        "logs the added owner address"
      );
      byteToString(receipt.logs[0].args._name).should.be.equal(
        "Los Encinos",
        "logs the added farm name"
      );
      byteToString(receipt.logs[0].args._country).should.be.equal(
        "Honduras",
        "logs the added farm country"
      );
      byteToString(receipt.logs[0].args._region).should.be.equal(
        "Francisco Morazan",
        "logs the added farm region"
      );
      byteToString(receipt.logs[0].args._village).should.be.equal(
        "Santa Lucia",
        "logs the added farm village"
      );
      receipt.logs[0].args._story.should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "logs the added farm story"
      );

      const count = await this.tokenInstance.getFarmersFarmsCount(accounts[0]);
      count.toNumber().should.be.equal(1, "Farms counter should increase");
    });

    it("Gets a farm", async () => {
      const farm = await this.tokenInstance.getFarmById(1);
      expect(farm[0].toNumber()).to.be.equal(1, "Uid equal to inserted");
      expect(byteToString(farm[1])).to.be.equal(
        "Los Encinos",
        "name equal to inserted"
      );
      expect(byteToString(farm[2])).to.be.equal(
        "Honduras",
        "country equal to inserted"
      );
      expect(byteToString(farm[3])).to.be.equal(
        "Francisco Morazan",
        "region equal to inserted"
      );
      expect(byteToString(farm[4])).to.be.equal(
        "Santa Lucia",
        "village equal to inserted"
      );
      farm[5].should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "story equal to inserted"
      );
    });

    it("Updates a farm", async () => {
      const receipt = await this.tokenInstance.updateFarm(
        1,
        "Los Encinos 2",
        "Honduras 2",
        "Francisco Morazan 2",
        "Santa Lucia 2",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2"
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogUpdateFarm",
        "should be the LogUpdateFarm event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "logs the updated farm id"
      );
      byteToString(receipt.logs[0].args._name).should.be.equal(
        "Los Encinos 2",
        "logs the added farm name"
      );
      byteToString(receipt.logs[0].args._country).should.be.equal(
        "Honduras 2",
        "logs the added farm country"
      );
      byteToString(receipt.logs[0].args._region).should.be.equal(
        "Francisco Morazan 2",
        "logs the added farm region"
      );
      byteToString(receipt.logs[0].args._village).should.be.equal(
        "Santa Lucia 2",
        "logs the added farm village"
      );
      receipt.logs[0].args._story.should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
        "logs the added farm story"
      );
      const farm = await this.tokenInstance.getFarmById.call(1);
      expect(farm[0].toNumber()).to.be.equal(1, "Uid equal to updated");
      expect(byteToString(farm[1])).to.be.equal(
        "Los Encinos 2",
        "name equal to updated"
      );
      expect(byteToString(farm[2])).to.be.equal(
        "Honduras 2",
        "country equal to updated"
      );
      expect(byteToString(farm[3])).to.be.equal(
        "Francisco Morazan 2",
        "region equal to updated"
      );
      expect(byteToString(farm[4])).to.be.equal(
        "Santa Lucia 2",
        "village equal to updated"
      );
      farm[5].should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
        "story equal to updated"
      );
    });
  });
});
