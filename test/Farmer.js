/*require("chai").should();
require("chai").expect;

var Farmer = artifacts.require("./Farmer.sol");

contract(Farmer, function(accounts) {
  function byteToString(a) {
    return trimNull(web3.toAscii(a));
  }
  function trimNull(a) {
    var c = a.indexOf("\0");
    if (c > -1) {
      return a.substr(0, c);
    }
    return a;
  }

  beforeEach(async () => {
    this.tokenInstance = await Farmer.deployed();
  });

  describe("Farmer Validations", () => {
    it("Adds a Farmer", async () => {
      const receipt = await this.tokenInstance.addFarmer(
        "Cristian Espinoza",
        "Honduras",
        "Francisco Morazan",
        "ceegarner@gmail.com",
        {
          from: accounts[1]
        }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddActor",
        "should be the LogAddActor event"
      );
      receipt.logs[0].args._id.should.be.equal(
        accounts[1],
        "logs the inserted farmer address"
      );
      const actorCount = await this.tokenInstance.getActorCount();
      expect(actorCount.toNumber()).to.be.equal(
        1,
        "farmers should had incremented"
      );
      var revert = true;
      try {
        const receiptFail = await this.tokenInstance.addFarmer(
          "Eduardo Garner",
          "Honduras",
          "Choluteca",
          "ceegarner@hotmail.com",
          {
            from: accounts[1]
          }
        );
      } catch (error) {
        expect(error).to.exist;
        revert = false;
      }

      if (revert) {
        assert.equal(revert, false, "should revert on adding same address");
      }
    });

    it("Gets a Farmer", async () => {
      const farmer = await this.tokenInstance.getFarmer(accounts[1], {
        from: accounts[0]
      });
      expect(byteToString(farmer[0])).to.be.equal(
        "Cristian Espinoza",
        "Name same as inserted"
      );
      expect(byteToString(farmer[1])).to.be.equal(
        "Honduras",
        "Country same as inserted"
      );
      expect(byteToString(farmer[2])).to.be.equal(
        "Francisco Morazan",
        "Region same as inserted"
      );
      expect(byteToString(farmer[3])).to.be.equal(
        "ceegarner@gmail.com",
        "Email same as inserted"
      );
    });

    it("Updates a farmer", async () => {
      const receipt = await this.tokenInstance.updateFarmer(
        "Eduardo Garner",
        "Honduras",
        "Choluteca",
        "ceegarner@hotmail.com",
        {
          from: accounts[1]
        }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogUpdateActor",
        "should be the LogUpdateActor event"
      );
      receipt.logs[0].args._id.should.be.equal(
        accounts[1],
        "logs the updated farmer address"
      );
      const farmer = await this.tokenInstance.getFarmer(accounts[1], {
        from: accounts[0]
      });
      expect(byteToString(farmer[0])).to.be.equal(
        "Eduardo Garner",
        "Name equal to updated"
      );
      expect(byteToString(farmer[1])).to.be.equal(
        "Honduras",
        "Country same as updated"
      );
      expect(byteToString(farmer[2])).to.be.equal(
        "Choluteca",
        "Region same as updated"
      );
      expect(byteToString(farmer[3])).to.be.equal(
        "ceegarner@hotmail.com",
        "Email same as updated"
      );
    });

    it("Validates account ownership", async () => {
      const farmer = await this.tokenInstance.returnOwner({
        from: accounts[1]
      });
      expect(byteToString(farmer[0])).to.be.equal(
        "Eduardo Garner",
        "It should return the user"
      );
      const farmerFail = await this.tokenInstance.returnOwner({
        from: accounts[2]
      });
      expect(byteToString(farmerFail[0]), "It shouldn't exist any user").to.be
        .empty;
    });
  });

  describe("Farm Validations", () => {
    it("Adds a farm", async () => {
      const receipt = await this.tokenInstance.addFarm(
        "Los Encinos",
        "Honduras",
        "Francisco Morazan",
        "Santa Lucia",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddFarm",
        "should be the LogAddFarm event"
      );
      receipt.logs[0].args._id.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "logs the added farm id"
      );
      const count = await this.tokenInstance.getFarmersFarmsCount(accounts[0]);
      count.toNumber().should.be.equal(1, "Farms counter should increase");
    });

    it("Gets a farm", async () => {
      const farm = await this.tokenInstance.getFarmById(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      farm[0].should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "Uid equal to inserted"
      );
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
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
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
      receipt.logs[0].args._id.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "logs the updated farm id"
      );
      const farm = await this.tokenInstance.getFarmById.call(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      farm[0].should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "Uid equal to updated"
      );
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
*/
