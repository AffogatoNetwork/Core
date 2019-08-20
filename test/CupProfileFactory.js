require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

var CupProfileFactory = artifacts.require("./CupProfileFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");
var FarmFactory = artifacts.require("./FarmFactory.sol");
var CoffeeBatchFactory = artifacts.require("./CoffeeBatchFactory");

contract(CupProfileFactory, function(accounts) {
  beforeEach(async () => {
    this.tokenInstance = await CupProfileFactory.deployed();
  });

  describe("Cup Profile Validations", () => {
    before(async () => {
      this.actorTokenInstance = await ActorFactory.deployed();
      this.farmTokenInstance = await FarmFactory.deployed();
      this.coffeeBatchTokenInstance = await CoffeeBatchFactory.deployed();
      await this.actorTokenInstance.addActor(web3.utils.utf8ToHex("FARMER"), {
        from: accounts[1]
      });
      await this.actorTokenInstance.addActor(web3.utils.utf8ToHex("TASTER"), {
        from: accounts[3]
      });
      await this.actorTokenInstance.addActor(web3.utils.utf8ToHex("TASTER"), {
        from: accounts[5]
      });
      await this.actorTokenInstance.addActor(
        web3.utils.utf8ToHex("CERTIFIER"),
        {
          from: accounts[4]
        }
      );
      await this.actorTokenInstance.approve(accounts[3], true, {
        from: accounts[1]
      });
      await this.actorTokenInstance.approve(accounts[4], true, {
        from: accounts[1]
      });

      await this.farmTokenInstance.addFarm(
        web3.utils.utf8ToHex("Los Encinos"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("Santa Lucia"),
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: accounts[1] }
      );
      await this.coffeeBatchTokenInstance.addCoffeeBatch(
        1,
        1200,
        web3.utils.utf8ToHex("Catuai Rojo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        web3.utils.utf8ToHex("Oro"),
        "{}",
        { from: accounts[1] }
      );
    });

    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

    it("Adds a cup profile", async () => {
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
        assert(err.reason === "not a taster");
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
        assert(err.reason === "not a taster");
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
  });

  describe("Contract Validations", () => {
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
        assert(
          err.reason === "PauserRole: caller does not have the Pauser role"
        );
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
        assert(err.reason === "Pausable: paused");
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
        assert(err.reason === "Pausable: paused");
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
        assert(err.reason === "Ownable: caller is not the owner");
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
