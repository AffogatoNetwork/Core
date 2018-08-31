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
    it("Adds a cupProfile", async () => {
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

    //   it("Gets a tasting", async () => {});

    //   it("Updates a tasting", async () => {});
  });
});
