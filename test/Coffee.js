require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));
var Coffee = artifacts.require("./Coffee.sol");

contract(Coffee, accounts => {
  beforeEach(async () => {
    this.tokenInstance = await Coffee.deployed();
  });

  describe("Coffee Bacth Validations", () => {
    it("Adds a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.addCoffeeBatch(
        1,
        1200,
        web3.utils.utf8ToHex("Catuai Rojo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        { from: accounts[0] }
      );
      receipt.logs.length.should.be.equal(1, "triggers one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddCoffeeBatch",
        "should be the LogAddCoffeeBatch event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "Logs the inserted uid"
      );
      expect(receipt.logs[0].args._owner).to.be.equal(
        accounts[0],
        "Logs the inserted owner"
      );
      expect(receipt.logs[0].args._farmUid.toNumber()).to.be.equal(
        1,
        "Logs the inserted Farm uid"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1200,
        "Logs the inserted altitude"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._variety)
        .should.be.equal("Catuai Rojo", "Logs the inserted variety");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._process)
        .should.be.equal("Washed", "Logs the inserted process");
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        10000,
        "Logs the inserted size"
      );
      receipt.logs[0].args._isSold.should.be.false;
      const count = await this.tokenInstance.getFarmCoffeeBatchCount(1);
      expect(count.toNumber()).to.be.equal(
        1,
        "Coffee Batches for farm should be 1"
      );
    });

    it("Gets a Coffee Batch", async () => {
      const coffeeBatch = await this.tokenInstance.getCoffeeBatchById(1);
      expect(coffeeBatch[0].toNumber()).to.be.equal(
        1,
        "batch id is equal to generated"
      );
      expect(coffeeBatch[1]).to.be.equal(
        accounts[0],
        "owner is equal to generated"
      );
      expect(coffeeBatch[2].toNumber()).to.be.equal(
        1,
        "farm uid is equal to inserted"
      );
      expect(coffeeBatch[3].toNumber()).to.be.equal(
        1200,
        "altitude is equal to inserted"
      );
      expect(web3.utils.hexToUtf8(coffeeBatch[4])).to.be.equal(
        "Catuai Rojo",
        "variety is equal to inserted"
      );
      expect(web3.utils.hexToUtf8(coffeeBatch[5])).to.be.equal(
        "Washed",
        "process is equal to inserted"
      );
      expect(coffeeBatch[6].toNumber()).to.be.equal(
        10000,
        "size is equal to inserted"
      );
    });

    it("Validates actor is owner ", async () => {
      const result = await this.tokenInstance.actorIsOwner(accounts[0], 1);
      result.should.be.true;
      const resultFail = await this.tokenInstance.actorIsOwner(accounts[1], 1);
      resultFail.should.be.false;
    });
  });
});
