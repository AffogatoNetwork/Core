require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

var CoffeeBatchFactory = artifacts.require("./CoffeeBatchFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");

contract(CoffeeBatchFactory, accounts => {
  beforeEach(async () => {
    this.actorTokenInstance = await ActorFactory.deployed();

    await this.actorTokenInstance.approve(accounts[5], true, {
      from: accounts[0]
    });
    await this.actorTokenInstance.approve(accounts[5], true, {
      from: accounts[8]
    });
    await this.actorTokenInstance.approve(accounts[6], true, {
      from: accounts[0]
    });
    this.tokenInstance = await CoffeeBatchFactory.deployed();
  });

  describe("Coffee Bacth Validations", () => {
    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

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

    it("...should update a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.updateCoffeeBatch(
        1,
        1,
        1250,
        web3.utils.utf8ToHex("Catuai Amarillo"),
        web3.utils.utf8ToHex("Washed"),
        20000,
        { from: accounts[0] }
      );
      receipt.logs.length.should.be.equal(1, "triggers one event");
      receipt.logs[0].event.should.be.equal(
        "LogUpdateCoffeeBatch",
        "should be the LogUpdateCoffeeBatch event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "Logs the updated uid"
      );
      expect(receipt.logs[0].args._owner).to.be.equal(
        accounts[0],
        "Logs the updated owner"
      );
      expect(receipt.logs[0].args._farmUid.toNumber()).to.be.equal(
        1,
        "Logs the updated Farm uid"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1250,
        "Logs the updated altitude"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._variety)
        .should.be.equal("Catuai Amarillo", "Logs the updated variety");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._process)
        .should.be.equal("Washed", "Logs the updated process");
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        20000,
        "Logs the updated size"
      );
      receipt.logs[0].args._isSold.should.be.false;
      const count = await this.tokenInstance.getFarmCoffeeBatchCount(1);
      expect(count.toNumber()).to.be.equal(
        1,
        "Coffee Batches for farm should still be 1"
      );

      let isException = false;
      try {
        await this.tokenInstance.updateCoffeeBatch(
          100,
          1,
          1250,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          20000,
          { from: accounts[0] }
        );
      } catch (err) {
        console.log(err);
        isException = true;
        assert(err.reason === "require coffee batch to exist");
      }
      expect(isException).to.be.equal(
        true,
        "it should revert on not existing coffee batch"
      );
      isException = false;
      try {
        await this.tokenInstance.updateCoffeeBatch(
          1,
          1,
          1250,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          20000,
          { from: accounts[1] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "require sender to be the owner");
      }
      expect(isException).to.be.equal(
        true,
        "it should revert on not owner of account"
      );
    });

    it("...should let a cooperative to add a Coffee Batch", async () => {
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
      const receipt = await this.tokenInstance.cooperativeAddCoffeeBatch(
        1,
        1200,
        web3.utils.utf8ToHex("Catuai Rojo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        accounts[0],
        { from: accounts[5] }
      );
      receipt.logs.length.should.be.equal(1, "triggers one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeAddCoffeeBatch",
        "should be the LogCooperativeAddCoffeeBatch event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        2,
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
      expect(receipt.logs[0].args._cooperativeAddress).to.be.equal(
        accounts[5],
        "Logs the inserted cooperative address"
      );
      receipt.logs[0].args._isSold.should.be.false;
      const count = await this.tokenInstance.getFarmCoffeeBatchCount(1);
      expect(count.toNumber()).to.be.equal(
        2,
        "Coffee Batches for farm should be 2"
      );

      let isException = false;
      try {
        await this.tokenInstance.cooperativeAddCoffeeBatch(
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          accounts[0],
          { from: accounts[1] }
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
        await this.tokenInstance.cooperativeAddCoffeeBatch(
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          accounts[0],
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

    it("...should let a cooperative to update a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.cooperativeUpdateCoffeeBatch(
        1,
        1,
        1300,
        web3.utils.utf8ToHex("Catuai Amarillo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        accounts[0],
        { from: accounts[5] }
      );
      receipt.logs.length.should.be.equal(1, "triggers one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeUpdateCoffeeBatch",
        "should be the LogCooperativeUpdateCoffeeBatch event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "Logs the updated uid"
      );
      expect(receipt.logs[0].args._owner).to.be.equal(
        accounts[0],
        "Logs the updated owner"
      );
      expect(receipt.logs[0].args._farmUid.toNumber()).to.be.equal(
        1,
        "Logs the updated Farm uid"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1300,
        "Logs the updated altitude"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._variety)
        .should.be.equal("Catuai Amarillo", "Logs the updated variety");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._process)
        .should.be.equal("Washed", "Logs the updated process");
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        10000,
        "Logs the updated size"
      );
      expect(receipt.logs[0].args._cooperativeAddress).to.be.equal(
        accounts[5],
        "Logs the updated cooperative address"
      );
      receipt.logs[0].args._isSold.should.be.false;
      const count = await this.tokenInstance.getFarmCoffeeBatchCount(1);
      expect(count.toNumber()).to.be.equal(
        2,
        "Coffee Batches for farm should be 2"
      );

      let isException = false;
      try {
        await this.tokenInstance.cooperativeUpdateCoffeeBatch(
          100,
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          accounts[0],
          { from: accounts[5] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "require coffee batch to exist");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on not existing coffee batch"
      );

      isException = false;
      try {
        await this.tokenInstance.cooperativeUpdateCoffeeBatch(
          1,
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          accounts[8],
          { from: accounts[5] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "require the farmer to be the owner");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on farmer not being the owner"
      );

      isException = false;
      try {
        await this.tokenInstance.cooperativeUpdateCoffeeBatch(
          1,
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          accounts[0],
          { from: accounts[1] }
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
        await this.tokenInstance.cooperativeUpdateCoffeeBatch(
          1,
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          accounts[0],
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
        await this.tokenInstance.addCoffeeBatch(
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          { from: accounts[0] }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Contract is paused");
      }
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
