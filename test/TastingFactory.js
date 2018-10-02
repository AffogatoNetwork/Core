require("chai").should();
require("chai").expect;

var TastingFactory = artifacts.require("./TastingFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");

contract(TastingFactory, function(accounts) {
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
    this.actorTokenInstance = await ActorFactory.deployed();
    this.tokenInstance = await TastingFactory.deployed();
    const allowed = await this.actorTokenInstance.approve(accounts[3], true, {
      from: accounts[1]
    });
  });

  describe("Tasting Validations", () => {
    it("Runs the constructor ", async () => {});

    it("Adds a cup profile", async () => {
      const receipt = await this.tokenInstance.addCupProfile(
        accounts[1],
        1,
        "Caramelo",
        "Cítrico",
        "balanceada",
        "balanceado",
        "seco",
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
      expect(byteToString(receipt.logs[0].args._aroma)).to.be.equal(
        "Caramelo",
        "logs the added cup profile aroma"
      );
      expect(byteToString(receipt.logs[0].args._flavor)).to.be.equal(
        "Cítrico",
        "logs the added cup profile flavor"
      );
      expect(byteToString(receipt.logs[0].args._acidity)).to.be.equal(
        "balanceada",
        "logs the added cup profile acidity"
      );
      expect(byteToString(receipt.logs[0].args._body)).to.be.equal(
        "balanceado",
        "logs the added cup profile body"
      );
      expect(byteToString(receipt.logs[0].args._aftertaste)).to.be.equal(
        "seco",
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
          "Caramelo",
          "Cítrico",
          "balanceada",
          "balanceado",
          "seco",
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
      expect(byteToString(cupProfile[1])).to.be.equal(
        "Caramelo",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[2])).to.be.equal(
        "Cítrico",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[3])).to.be.equal(
        "balanceada",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[4])).to.be.equal(
        "balanceado",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[5])).to.be.equal(
        "seco",
        "Value is equal to inserted"
      );
      expect(cupProfile[6].toNumber()).to.be.equal(
        8000,
        "Value is equal to inserted"
      );
    });

    it("Updates a cup profile", async () => {
      const receipt = await this.tokenInstance.updateCupProfileById(
        1,
        "Rosas",
        "Citrico 2",
        "balanceada 2",
        "balanceado 2",
        "Prolongado 2",
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

      expect(byteToString(cupProfile[1])).to.be.equal(
        "Rosas",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[2])).to.be.equal(
        "Citrico 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[3])).to.be.equal(
        "balanceada 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[4])).to.be.equal(
        "balanceado 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[5])).to.be.equal(
        "Prolongado 2",
        "Value is equal to updated"
      );
      expect(cupProfile[6].toNumber()).to.be.equal(
        9000,
        "Value is equal to updated"
      );
    });
  });
});
