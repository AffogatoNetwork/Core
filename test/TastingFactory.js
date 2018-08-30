/*require("chai").should();
require("chai").expect;

var Taster = artifacts.require("./Taster.sol");
var Farmer = artifacts.require("./Farmer.sol");

contract(Taster, function(accounts) {
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
    this.tokenInstance = await Taster.deployed();
  });

  describe("Taster Validations", () => {
    it("Adds a Taster", async () => {
      const receipt = await this.tokenInstance.addTaster(
        "Toño Stark",
        "Honduras",
        "Francisco Morazan",
        "tony@stark.com",
        "Percolator french press sweet in caffeine kopi-luwak single origin. Cinnamon ristretto mocha instant grounds est, affogato extra flavour medium half and half. Doppio con panna aged, kopi-luwak foam, aroma arabica coffee café au lait seasonal to go crema.",
        { from: accounts[3] }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddActor",
        "should be the LogAddActor event"
      );
      receipt.logs[0].args._id.should.be.equal(
        accounts[3],
        "logs the inserted taster address"
      );
      const actorCount = await this.tokenInstance.getActorCount();
      expect(actorCount.toNumber()).to.be.equal(
        1,
        "tasters should had incremented"
      );
      var revert = true;
      try {
        const receiptFail = await this.tokenInstance.addTaster(
          "Eduardo Garner",
          "Honduras",
          "Choluteca",
          "ceegarner@hotmail.com",
          "Percolator french press sweet in caffeine kopi-luwak single origin. Cinnamon ristretto mocha instant grounds est, affogato extra flavour medium half and half. Doppio con panna aged, kopi-luwak foam, aroma arabica coffee café au lait seasonal to go crema.",
          {
            from: accounts[3]
          }
        );
      } catch (error) {
        expect(error).to.exist;
        revert = false;
      }
      if (revert) {
        assert.equal(
          revert,
          false,
          "should revert on adding same taster address"
        );
      }
    });

    it("Validates unique address for actor", async () => {
      this.tokenInstance = await Farmer.deployed();
      const receipt = await this.tokenInstance.addFarmer(
        "Cristian Espinoza",
        "Honduras",
        "Francisco Morazan",
        "ceegarner@gmail.com",
        {
          from: accounts[1]
        }
      );
      revert = true;
      try {
        const receiptFail = await this.tokenInstance.addTaster(
          "Eduardo Garner",
          "Honduras",
          "Choluteca",
          "ceegarner@hotmail.com",
          "Percolator french press sweet in caffeine kopi-luwak single origin. Cinnamon ristretto mocha instant grounds est, affogato extra flavour medium half and half. Doppio con panna aged, kopi-luwak foam, aroma arabica coffee café au lait seasonal to go crema.",
          {
            from: accounts[1]
          }
        );
      } catch (error) {
        expect(error).to.exist;
        revert = false;
      }

      if (revert) {
        assert.equal(
          revert,
          false,
          "should revert on adding existing actor address"
        );
      }
    });

    it("Gets a Taster", async () => {});

    it("Updates a Taster", async () => {});

    it("Validates account ownership", async () => {});
  });

  describe("Tasting Validations", () => {
    it("Adds a tasting", async () => {});

    it("Gets a tasting", async () => {});

    it("Updates a tasting", async () => {});
  });
});*/
