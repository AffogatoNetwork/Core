require("chai").should();
require("chai").expect;

var TastingFactory = artifacts.require("./TastingFactory.sol");

contract(TastingFactory, function(accounts) {
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
    this.tokenInstance = await TastingFactory.deployed();
  });

  describe("Tasting Validations", () => {
    it("Adds a cup profile", async () => {
      const receipt = await this.tokenInstance.addCupProfile(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "Caramelo",
        "Citrico",
        "balanceada",
        "balanceado",
        "seco",
        8000
      );

      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddCupProfile",
        "should be the LogAddCupProfile event"
      );
      receipt.logs[0].args._id.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "logs the added cup profile id"
      );

      const countTaster = await this.tokenInstance.getTasterCupProfileCount(
        accounts[0]
      );
      expect(countTaster.toNumber()).to.be.equal(
        1,
        "Taster Profiles counter should increase"
      );
      const countCoffeeBatch = await this.tokenInstance.getCoffeeCupProfileCount(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      expect(countCoffeeBatch.toNumber()).to.be.equal(
        1,
        "Coffee Batches Cup Profiles counter should increase"
      );
    });

    it("Gets a cup profile", async () => {
      const cupProfile = await this.tokenInstance.getCupProfileById(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      cupProfile[0].should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      expect(byteToString(cupProfile[1])).to.be.equal("Caramelo");
      expect(byteToString(cupProfile[2])).to.be.equal("Citrico");
      expect(byteToString(cupProfile[3])).to.be.equal("balanceada");
      expect(byteToString(cupProfile[4])).to.be.equal("balanceado");
      expect(byteToString(cupProfile[5])).to.be.equal("seco");
      expect(cupProfile[6].toNumber()).to.be.equal(8000);
    });

    it("Updates a cup profile", async () => {
      const receipt = await this.tokenInstance.updateCupProfileById(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
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
      receipt.logs[0].args._id.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "logs the yodated cup profile id"
      );

      const cupProfile = await this.tokenInstance.getCupProfileById(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );

      expect(byteToString(cupProfile[1])).to.be.equal("Rosas");
      expect(byteToString(cupProfile[2])).to.be.equal("Citrico 2");
      expect(byteToString(cupProfile[3])).to.be.equal("balanceada 2");
      expect(byteToString(cupProfile[4])).to.be.equal("balanceado 2");
      expect(byteToString(cupProfile[5])).to.be.equal("Prolongado 2");
      expect(cupProfile[6].toNumber()).to.be.equal(9000);
    });
  });
});
