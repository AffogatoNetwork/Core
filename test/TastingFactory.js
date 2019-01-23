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
    const allowed = await this.actorTokenInstance.approve(accounts[3], true, {
      from: accounts[1]
    });
  });

  describe("Tasting Validations", () => {
    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

    it("Adds a cup profile", async () => {
      const receipt = await this.tokenInstance.addCupProfile(
        accounts[1],
        1,
        web3.utils.utf8ToHex("Caramelo"),
        web3.utils.utf8ToHex("Panela"),
        web3.utils.utf8ToHex("Frutas"),
        web3.utils.utf8ToHex("citrica"),
        web3.utils.utf8ToHex("ligero"),
        web3.utils.utf8ToHex("prolongado"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        8000,
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
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._aroma)).to.be.equal(
        "Caramelo",
        "logs the added cup profile aroma"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._sweetness)).to.be.equal(
        "Panela",
        "logs the added cup profile sweetness"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._flavor)).to.be.equal(
        "Frutas",
        "logs the added cup profile flavor"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._acidity)).to.be.equal(
        "citrica",
        "logs the added cup profile acidity"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._body)).to.be.equal(
        "ligero",
        "logs the added cup profile body"
      );
      expect(
        web3.utils.hexToUtf8(receipt.logs[0].args._aftertaste)
      ).to.be.equal("prolongado", "logs the added cup profile aftertaste");
      expect(receipt.logs[0].args._imageHash).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "logs the added cup profile aftertaste"
      );
      expect(receipt.logs[0].args._cuppingNote.toNumber()).to.be.equal(
        8000,
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

      try {
        var result = true;
        const receiptFail = await this.tokenInstance.addCupProfile(
          accounts[1],
          1,
          web3.utils.utf8ToHex("Caramelo"),
          web3.utils.utf8ToHex("Panela"),
          web3.utils.utf8ToHex("citrica"),
          web3.utils.utf8ToHex("ligero"),
          web3.utils.utf8ToHex("Frutas"),
          web3.utils.utf8ToHex("prolongado"),
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          8000,
          { from: accounts[4] }
        );
      } catch (error) {
        result = false;
      }
      if (result) {
        expect(result).to.be.equal(
          false,
          "it should revert on not allowed account"
        );
      }
    });

    it("Gets a cup profile", async () => {
      const cupProfile = await this.tokenInstance.getCupProfileById(1);
      expect(cupProfile[0].toNumber()).to.be.equal(1);
      expect(web3.utils.hexToUtf8(cupProfile[1])).to.be.equal(
        "Caramelo",
        "Value is equal to inserted"
      );
      expect(web3.utils.hexToUtf8(cupProfile[2])).to.be.equal(
        "Panela",
        "Value is equal to inserted"
      );
      expect(web3.utils.hexToUtf8(cupProfile[3])).to.be.equal(
        "Frutas",
        "Value is equal to inserted"
      );
      expect(web3.utils.hexToUtf8(cupProfile[4])).to.be.equal(
        "citrica",
        "Value is equal to inserted"
      );
      expect(web3.utils.hexToUtf8(cupProfile[5])).to.be.equal(
        "ligero",
        "Value is equal to inserted"
      );
      expect(web3.utils.hexToUtf8(cupProfile[6])).to.be.equal(
        "prolongado",
        "Value is equal to inserted"
      );
      expect(cupProfile[7]).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Value is equal to inserted"
      );
      expect(cupProfile[8].toNumber()).to.be.equal(
        8000,
        "Value is equal to inserted"
      );
    });

    it("Updates a cup profile", async () => {
      const receipt = await this.tokenInstance.updateCupProfileById(
        1,
        web3.utils.utf8ToHex("Caramelo 2"),
        web3.utils.utf8ToHex("Panela 2"),
        web3.utils.utf8ToHex("Frutas 2"),
        web3.utils.utf8ToHex("citrica 2"),
        web3.utils.utf8ToHex("ligero 2"),
        web3.utils.utf8ToHex("prolongado 2"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        9000
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
      expect(web3.utils.hexToUtf8(cupProfile[1])).to.be.equal(
        "Caramelo 2",
        "Value is equal to updated"
      );
      expect(web3.utils.hexToUtf8(cupProfile[2])).to.be.equal(
        "Panela 2",
        "Value is equal to updated"
      );
      expect(web3.utils.hexToUtf8(cupProfile[3])).to.be.equal(
        "Frutas 2",
        "Value is equal to updated"
      );
      expect(web3.utils.hexToUtf8(cupProfile[4])).to.be.equal(
        "citrica 2",
        "Value is equal to updated"
      );
      expect(web3.utils.hexToUtf8(cupProfile[5])).to.be.equal(
        "ligero 2",
        "Value is equal to updated"
      );

      expect(web3.utils.hexToUtf8(cupProfile[6])).to.be.equal(
        "prolongado 2",
        "Value is equal to updated"
      );
      expect(cupProfile[7]).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Value is equal to updated"
      );
      expect(cupProfile[8].toNumber()).to.be.equal(
        9000,
        "Value is equal to updated"
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
          web3.utils.utf8ToHex("Caramelo"),
          web3.utils.utf8ToHex("Panela"),
          web3.utils.utf8ToHex("Frutas"),
          web3.utils.utf8ToHex("citrica"),
          web3.utils.utf8ToHex("ligero"),
          web3.utils.utf8ToHex("prolongado"),
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          8000,
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
          web3.utils.utf8ToHex("Caramelo 2"),
          web3.utils.utf8ToHex("Panela 2"),
          web3.utils.utf8ToHex("Frutas 2"),
          web3.utils.utf8ToHex("citrica 2"),
          web3.utils.utf8ToHex("ligero 2"),
          web3.utils.utf8ToHex("prolongado 2"),
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          9000
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
