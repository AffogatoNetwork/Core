require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

var TastingFactory = artifacts.require("./TastingFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");

contract(TastingFactory, function(accounts) {
  beforeEach(async () => {
    this.actorTokenInstance = await ActorFactory.deployed();
    this.tokenInstance = await TastingFactory.deployed();
    await this.actorTokenInstance.approve(accounts[3], true, {
      from: accounts[1]
    });
    await this.actorTokenInstance.approve(accounts[4], true, {
      from: accounts[1]
    });
  });

  describe("Tasting Validations", () => {
    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

    it("Adds a cup profile", async () => {
      //creates a taster
      await this.actorTokenInstance.addActor(
        web3.utils.utf8ToHex("Taster Hulk"),
        web3.utils.utf8ToHex("taster"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("taster@stark.com"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dui nunc, fermentum id fermentum sit amet, ornare id risus. Pellentesque sit amet pellentesque justo. In sit amet nibh turpis. Sed dictum ornare erat. Ut tempus nulla quis imperdiet accumsan. Ut nec lacus vel neque tincidunt tempus eu in urna. Vivamus in risus a tortor semper suscipit id vitae enim.",
        { from: accounts[3] }
      );
      const receipt = await this.tokenInstance.addCupProfile(
        accounts[1],
        1,
        "Caramelo, Panela, Frutas, citrica, ligero, prolongado",
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        80,
        {
          from: accounts[3]
        }
      );

      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddCupProfile",
        "should be the LogAddCupProfile event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "logs the added cup profile id"
      );
      expect(receipt.logs[0].args._coffeeBatchId.toNumber()).to.be.equal(
        1,
        "logs the added profile coffee batch id"
      );
      receipt.logs[0].args._tasterAddress.should.be.equal(
        accounts[3],
        "logs the added profile taster address"
      );
      expect(receipt.logs[0].args._profile).to.be.equal(
        "Caramelo, Panela, Frutas, citrica, ligero, prolongado",
        "logs the added profile "
      );
      expect(receipt.logs[0].args._imageHash).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "logs the added cup profile aftertaste"
      );
      expect(receipt.logs[0].args._cuppingNote.toNumber()).to.be.equal(
        80,
        "logs the added profile coffee cupping note"
      );

      const countTaster = await this.tokenInstance.getTasterCupProfileCount(
        accounts[3]
      );
      expect(countTaster.toNumber()).to.be.equal(
        1,
        "Taster Profiles counter should increase"
      );
      const countCoffeeBatch = await this.tokenInstance.getCoffeeCupProfileCount(
        1
      );
      expect(countCoffeeBatch.toNumber()).to.be.equal(
        1,
        "Coffee Batches Cup Profiles counter should increase"
      );
      let isException = false;
      try {
        await this.tokenInstance.addCupProfile(
          accounts[1],
          1,
          "Caramelo, Panela, Frutas, citrica, ligero, prolongado",
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          80,
          { from: accounts[5] }
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
        await this.tokenInstance.addCupProfile(
          accounts[1],
          1,
          "Caramelo, Panela, Frutas, citrica, ligero, prolongado",
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          80,
          { from: accounts[4] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "require sender to be a taster");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on not taster account"
      );
    });

    it("Gets a cup profile", async () => {
      const cupProfile = await this.tokenInstance.getCupProfileById(1);
      expect(cupProfile[0].toNumber()).to.be.equal(1);
      expect(cupProfile[1]).to.be.equal(
        "Caramelo, Panela, Frutas, citrica, ligero, prolongado",
        "lValue is equal to inserted"
      );
      expect(cupProfile[2]).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Value is equal to inserted"
      );
      expect(cupProfile[3].toNumber()).to.be.equal(
        80,
        "Value is equal to inserted"
      );
      expect(cupProfile[4]).to.be.equal(
        accounts[3],
        "Value is equal to inserted"
      );
    });

    it("Updates a cup profile", async () => {
      const receipt = await this.tokenInstance.updateCupProfileById(
        1,
        "Caramelo, Panela, Frutas, citrica, ligero, prolongado 2",
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        90,
        {
          from: accounts[3]
        }
      );

      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogUpdateCupProfile",
        "should be the LogUpdateCupProfile event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "logs the updated cup profile id"
      );
      const cupProfile = await this.tokenInstance.getCupProfileById(1);
      expect(cupProfile[1]).to.be.equal(
        "Caramelo, Panela, Frutas, citrica, ligero, prolongado 2",
        "lValue is equal to inserted"
      );
      expect(cupProfile[2]).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Value is equal to updated"
      );
      expect(cupProfile[3].toNumber()).to.be.equal(
        90,
        "Value is equal to updated"
      );

      let isException = false;
      try {
        await this.tokenInstance.updateCupProfileById(
          1,
          "Caramelo, Panela, Frutas, citrica, ligero, prolongado 2",
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          80,
          { from: accounts[4] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "require sender to be a taster");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on not taster account"
      );

      isException = false;
      try {
        await this.tokenInstance.updateCupProfileById(
          100,
          "Caramelo, Panela, Frutas, citrica, ligero, prolongado 2",
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          80,
          { from: accounts[3] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "cup profile should't be empty");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on empty cup profile"
      );
      await this.actorTokenInstance.addActor(
        web3.utils.utf8ToHex("Taster Hulk 2"),
        web3.utils.utf8ToHex("taster"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("taster2@stark.com"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dui nunc, fermentum id fermentum sit amet, ornare id risus. Pellentesque sit amet pellentesque justo. In sit amet nibh turpis. Sed dictum ornare erat. Ut tempus nulla quis imperdiet accumsan. Ut nec lacus vel neque tincidunt tempus eu in urna. Vivamus in risus a tortor semper suscipit id vitae enim.",
        { from: accounts[5] }
      );
      isException = false;
      try {
        await this.tokenInstance.updateCupProfileById(
          1,
          "Caramelo, Panela, Frutas, citrica, ligero, prolongado 2",
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          80,
          { from: accounts[5] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "updater should be the taster");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on updater not being the taster"
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
        await this.tokenInstance.addCupProfile(
          accounts[1],
          1,
          "Caramelo, Panela, Frutas, citrica, ligero, prolongado",
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          80,
          {
            from: accounts[3]
          }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Contract is paused");
      }
      expect(revert).to.equal(true, "Should revert on paused contract");
      revert = false;
      try {
        await this.tokenInstance.updateCupProfileById(
          1,
          "Caramelo, Panela, Frutas, citrica, ligero, prolongado",
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          90
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
