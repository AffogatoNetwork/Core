require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

var FarmFactory = artifacts.require("./FarmFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");

contract(FarmFactory, function(accounts) {
  beforeEach(async () => {
    this.actorTokenInstance = await ActorFactory.deployed();

    this.tokenInstance = await FarmFactory.deployed();
    await this.actorTokenInstance.approve(accounts[5], true, {
      from: accounts[1]
    });
    await this.actorTokenInstance.approve(accounts[6], true, {
      from: accounts[1]
    });
  });

  describe("Farm Validations", () => {
    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

    it("Adds a farm", async () => {
      const receipt = await this.tokenInstance.addFarm(
        web3.utils.utf8ToHex("Los Encinos"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("Santa Lucia"),
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
      web3.utils
        .hexToUtf8(receipt.logs[0].args._name)
        .should.be.equal("Los Encinos", "logs the added farm name");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._country)
        .should.be.equal("Honduras", "logs the added farm country");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._region)
        .should.be.equal("Francisco Morazan", "logs the added farm region");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._village)
        .should.be.equal("Santa Lucia", "logs the added farm village");
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
      expect(web3.utils.hexToUtf8(farm[1])).to.be.equal(
        "Los Encinos",
        "name equal to inserted"
      );
      expect(web3.utils.hexToUtf8(farm[2])).to.be.equal(
        "Honduras",
        "country equal to inserted"
      );
      expect(web3.utils.hexToUtf8(farm[3])).to.be.equal(
        "Francisco Morazan",
        "region equal to inserted"
      );
      expect(web3.utils.hexToUtf8(farm[4])).to.be.equal(
        "Santa Lucia",
        "village equal to inserted"
      );
      farm[5].should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "story equal to inserted"
      );
      farm[6].should.be.equal(accounts[0], "owner equal to inserted");
    });

    it("Updates a farm", async () => {
      const receipt = await this.tokenInstance.updateFarm(
        1,
        web3.utils.utf8ToHex("Los Encinos 2"),
        web3.utils.utf8ToHex("Honduras 2"),
        web3.utils.utf8ToHex("Francisco Morazan 2"),
        web3.utils.utf8ToHex("Santa Lucia 2"),
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
        { from: accounts[0] }
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
      receipt.logs[0].args._ownerAddress.should.be.equal(
        accounts[0],
        "logs the updated farmer address"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._name)
        .should.be.equal("Los Encinos 2", "logs the added farm name");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._country)
        .should.be.equal("Honduras 2", "logs the added farm country");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._region)
        .should.be.equal("Francisco Morazan 2", "logs the added farm region");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._village)
        .should.be.equal("Santa Lucia 2", "logs the added farm village");
      receipt.logs[0].args._story.should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
        "logs the added farm story"
      );
      const farm = await this.tokenInstance.getFarmById.call(1);
      expect(farm[0].toNumber()).to.be.equal(1, "Uid equal to updated");
      expect(web3.utils.hexToUtf8(farm[1])).to.be.equal(
        "Los Encinos 2",
        "name equal to updated"
      );
      expect(web3.utils.hexToUtf8(farm[2])).to.be.equal(
        "Honduras 2",
        "country equal to updated"
      );
      expect(web3.utils.hexToUtf8(farm[3])).to.be.equal(
        "Francisco Morazan 2",
        "region equal to updated"
      );
      expect(web3.utils.hexToUtf8(farm[4])).to.be.equal(
        "Santa Lucia 2",
        "village equal to updated"
      );
      farm[5].should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
        "story equal to updated"
      );

      try {
        var result = true;
        const receiptFail = await this.tokenInstance.updateFarm(
          1,
          web3.utils.utf8ToHex("Los Encinos 2"),
          web3.utils.utf8ToHex("Honduras 2"),
          web3.utils.utf8ToHex("Francisco Morazan 2"),
          web3.utils.utf8ToHex("Santa Lucia 2"),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
          { from: accounts[4] }
        );
      } catch (error) {
        result = false;
      }

      if (result) {
        expect(result).to.be.equal(false, "it should revert on not owner");
      }
    });

    it("...should allow a cooperative to add a farm", async () => {
      await this.actorTokenInstance.addActor(
        web3.utils.utf8ToHex("Frederick Tercero"),
        web3.utils.utf8ToHex("cooperative"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("freederick@stark.com"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dui nunc, fermentum id fermentum sit amet, ornare id risus.",
        { from: accounts[5] }
      );
      const receipt = await this.tokenInstance.cooperativeAddFarm(
        web3.utils.utf8ToHex("Cual Tricicleta"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("Valle de Angeles"),
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        accounts[1],
        { from: accounts[5] }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeAddFarm",
        "should be the LogCooperativeAddFarm event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        2,
        "logs the added farm id"
      );
      receipt.logs[0].args._ownerAddress.should.be.equal(
        accounts[1],
        "logs the added owner address"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._name)
        .should.be.equal("Cual Tricicleta", "logs the added farm name");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._country)
        .should.be.equal("Honduras", "logs the added farm country");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._region)
        .should.be.equal("Francisco Morazan", "logs the added farm region");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._village)
        .should.be.equal("Valle de Angeles", "logs the added farm village");
      receipt.logs[0].args._story.should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "logs the added farm story"
      );
      receipt.logs[0].args._cooperativeAddress.should.be.equal(
        accounts[5],
        "logs the added cooperative address"
      );

      const count = await this.tokenInstance.getFarmersFarmsCount(accounts[1]);
      count.toNumber().should.be.equal(1, "Farms counter should increase");
      let isException = false;
      try {
        await this.tokenInstance.cooperativeAddFarm(
          web3.utils.utf8ToHex("Cual Tricicleta"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Francisco Morazan"),
          web3.utils.utf8ToHex("Valle de Angeles"),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          accounts[1],
          { from: accounts[4] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not authorized");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on not allowed account"
      );
      isException = false;

      try {
        await this.tokenInstance.cooperativeAddFarm(
          web3.utils.utf8ToHex("Cual Tricicleta"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Francisco Morazan"),
          web3.utils.utf8ToHex("Valle de Angeles"),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          accounts[1],
          { from: accounts[6] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not a cooperative");
      }
      expect(isException).to.be.equal(
        true,
        "it should revert on not a cooperative account"
      );
    });

    it("...should allow cooperative to updates a farm", async () => {
      const receipt = await this.tokenInstance.cooperativeUpdateFarm(
        2,
        web3.utils.utf8ToHex("Cual Tricicleta 2"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("Santa Lucia"),
        "Lorem ipsum.",
        accounts[1],
        { from: accounts[5] }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeUpdateFarm",
        "should be the LogCooperativeUpdateFarm event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        2,
        "logs the updated farm id"
      );
      receipt.logs[0].args._ownerAddress.should.be.equal(
        accounts[1],
        "logs the updated owner address"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._name)
        .should.be.equal("Cual Tricicleta 2", "logs the updated farm name");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._country)
        .should.be.equal("Honduras", "logs the updated farm country");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._region)
        .should.be.equal("Francisco Morazan", "logs the updated farm region");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._village)
        .should.be.equal("Santa Lucia", "logs the updated farm village");
      receipt.logs[0].args._story.should.be.equal(
        "Lorem ipsum.",
        "logs the updated farm story"
      );
      receipt.logs[0].args._cooperativeAddress.should.be.equal(
        accounts[5],
        "logs the updated cooperative address"
      );

      const count = await this.tokenInstance.getFarmersFarmsCount(accounts[1]);
      count.toNumber().should.be.equal(1, "Farms counter should stay the same");
      let isException = false;
      try {
        await this.tokenInstance.cooperativeUpdateFarm(
          2,
          web3.utils.utf8ToHex("Cual Tricicleta 3"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Francisco Morazan"),
          web3.utils.utf8ToHex("Santa Lucia"),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          accounts[1],
          { from: accounts[4] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not authorized");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on not allowed account"
      );
      isException = false;

      try {
        await this.tokenInstance.cooperativeUpdateFarm(
          2,
          web3.utils.utf8ToHex("Cual Tricicleta 3"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Francisco Morazan"),
          web3.utils.utf8ToHex("Valle de Angeles"),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          accounts[1],
          { from: accounts[6] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not a cooperative");
      }
      expect(isException).to.be.equal(
        true,
        "it should revert on not a cooperative account"
      );
    });

    it("...should pause and unpause the contract.", async () => {
      var receipt = await this.tokenInstance.pause({
        from: accounts[0]
      });
      receipt.logs.length.should.equal(1, "trigger one event");
      receipt.logs[0].event.should.equal(
        "Paused",
        "should be the Paused event"
      );
      var paused = await this.tokenInstance.paused({
        from: accounts[0]
      });
      paused.should.be.true;
      var revert = false;
      try {
        await this.tokenInstance.pause({
          from: accounts[1]
        });
      } catch (err) {
        revert = true;
        assert(err.reason === "Only owner");
      }
      expect(revert).to.equal(true, "Should revert on no permissions");
      var receipt = await this.tokenInstance.unpause({
        from: accounts[0]
      });
      receipt.logs.length.should.equal(1, "trigger one event");
      receipt.logs[0].event.should.equal(
        "Unpaused",
        "should be the Unpaused event"
      );
      paused = await this.tokenInstance.paused({
        from: accounts[0]
      });
      paused.should.be.false;
    });

    it("...should stop on pause.", async () => {
      await this.tokenInstance.pause({
        from: accounts[0]
      });
      var revert = false;
      try {
        await this.tokenInstance.addFarm(
          web3.utils.utf8ToHex("Los Encinos"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Francisco Morazan"),
          web3.utils.utf8ToHex("Santa Lucia"),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          { from: accounts[0] }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Contract is paused");
      }
      expect(revert).to.equal(true, "Should revert on paused contract");
      revert = false;
      try {
        await this.tokenInstance.updateFarm(
          1,
          web3.utils.utf8ToHex("Los Encinos 2"),
          web3.utils.utf8ToHex("Honduras 2"),
          web3.utils.utf8ToHex("Francisco Morazan 2"),
          web3.utils.utf8ToHex("Santa Lucia 2"),
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
          { from: accounts[0] }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Contract is paused");
      }
      expect(revert).to.equal(true, "Should revert on paused contract");
      await this.tokenInstance.unpause({
        from: accounts[0]
      });
    });

    it("...should selfdestruct only by owner.", async () => {
      revert = false;
      try {
        await this.tokenInstance.destroy({ from: accounts[1] });
      } catch (err) {
        revert = true;
        assert(err.reason === "Only owner");
      }
      expect(revert).to.equal(true, "Should revert on not owner");
      const code = await web3.eth.getCode(this.tokenInstance.address);
      code.should.not.equal("0x");
    });

    /*TODO: Refactor everything to another test
    it("...should delete the contract.", async () => {
      await this.tokenInstance.destroy({ from: accounts[0] });
      const code = await web3.eth.getCode(this.tokenInstance.address);
      code.should.equal("0x");
    });*/
  });
});
