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
    it("Adds a cup profile", async () => {
      const receipt = await this.tokenInstance.addCupProfile(
        accounts[1],
        1,
        "Caramelo",
        "Panela",
        "Frutas",
        "citrica",
        "ligero",
        "prolongado",
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
      expect(byteToString(receipt.logs[0].args._aroma)).to.be.equal(
        "Caramelo",
        "logs the added cup profile aroma"
      );
      expect(byteToString(receipt.logs[0].args._sweetness)).to.be.equal(
        "Panela",
        "logs the added cup profile sweetness"
      );
      expect(byteToString(receipt.logs[0].args._flavor)).to.be.equal(
        "Frutas",
        "logs the added cup profile flavor"
      );
      expect(byteToString(receipt.logs[0].args._acidity)).to.be.equal(
        "citrica",
        "logs the added cup profile acidity"
      );
      expect(byteToString(receipt.logs[0].args._body)).to.be.equal(
        "ligero",
        "logs the added cup profile body"
      );
      expect(byteToString(receipt.logs[0].args._aftertaste)).to.be.equal(
        "prolongado",
        "logs the added cup profile aftertaste"
      );
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
          "Caramelo",
          "Panela",
          "citrica",
          "ligero",
          "Frutas",
          "prolongado",
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
      expect(byteToString(cupProfile[1])).to.be.equal(
        "Caramelo",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[2])).to.be.equal(
        "Panela",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[3])).to.be.equal(
        "Frutas",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[4])).to.be.equal(
        "citrica",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[5])).to.be.equal(
        "ligero",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[6])).to.be.equal(
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
        "Caramelo 2",
        "Panela 2",
        "Frutas 2",
        "citrica 2",
        "ligero 2",
        "prolongado 2",
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
      expect(byteToString(cupProfile[1])).to.be.equal(
        "Caramelo 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[2])).to.be.equal(
        "Panela 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[3])).to.be.equal(
        "Frutas 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[4])).to.be.equal(
        "citrica 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[5])).to.be.equal(
        "ligero 2",
        "Value is equal to updated"
      );

      expect(byteToString(cupProfile[6])).to.be.equal(
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
  });
});
