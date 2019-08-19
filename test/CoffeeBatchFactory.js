require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

var CoffeeBatchFactory = artifacts.require("./CoffeeBatchFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");
var FarmFactory = artifacts.require("./FarmFactory.sol");

contract(CoffeeBatchFactory, accounts => {
  beforeEach(async () => {
    this.tokenInstance = await CoffeeBatchFactory.deployed();
  });

  describe("Coffee Batch Validations", () => {
    before(async () => {
      this.actorTokenInstance = await ActorFactory.deployed();
      this.farmTokenInstance = await FarmFactory.deployed();
      await this.actorTokenInstance.addActor(web3.utils.utf8ToHex("FARMER"), {
        from: accounts[0]
      });
      await this.farmTokenInstance.addFarm(
        web3.utils.utf8ToHex("Los Encinos"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("Santa Lucia"),
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: accounts[0] }
      );
    });

    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

    it("...should add a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.addCoffeeBatch(
        1,
        1200,
        web3.utils.utf8ToHex("Catuai Rojo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        web3.utils.utf8ToHex("Oro"),
        "{}",
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
      expect(receipt.logs[0].args._farmId.toNumber()).to.be.equal(
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
      receipt.logs[0].args._additionalInformation.should.be.equal(
        "{}",
        "Logs the inserted additional information"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._coffeeState)
        .should.be.equal("Oro", "Logs the inserted state");
      let isException = false;
      try {
        await this.tokenInstance.addCoffeeBatch(
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          web3.utils.utf8ToHex("Oro"),
          "{}",
          { from: accounts[9] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not a farmer");
      }
      isException.should.equal(true, "should revert on not a farmer account");

      isException = false;
      try {
        await this.tokenInstance.addCoffeeBatch(
          2,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          web3.utils.utf8ToHex("Oro"),
          "{}",
          { from: accounts[0] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not the owner of the farm");
      }
      isException.should.equal(true, "should revert on the owner of the farm");
    });

    it("...should get a Coffee Batch", async () => {
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
      expect(web3.utils.hexToUtf8(coffeeBatch[7])).to.be.equal(
        "Oro",
        "state is equal to inserted"
      );
      expect(coffeeBatch[8]).to.be.equal("{}", "state is equal to inserted");
    });

    it("...should update a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.updateCoffeeBatch(
        1,
        1,
        1250,
        web3.utils.utf8ToHex("Catuai Amarillo"),
        web3.utils.utf8ToHex("Washed"),
        20000,
        web3.utils.utf8ToHex("Pergamino"),
        "{1}",
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
      expect(receipt.logs[0].args._farmId.toNumber()).to.be.equal(
        1,
        "Logs the updated Farm uid"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1250,
        "Logs the updated altitude"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._variety)).to.be.equal(
        "Catuai Amarillo",
        "Logs the updated variety"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._process)).to.be.equal(
        "Washed",
        "Logs the updated process"
      );
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        20000,
        "Logs the updated size"
      );
      expect(
        web3.utils.hexToUtf8(receipt.logs[0].args._coffeeState)
      ).to.be.equal("Pergamino", "Logs the updated process");
      receipt.logs[0].args._additionalInformation.should.be.equal(
        "{1}",
        "Logs the updated additional information"
      );

      let isException = false;
      try {
        await this.tokenInstance.updateCoffeeBatch(
          1,
          1,
          1250,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          20000,
          web3.utils.utf8ToHex("Pergamino"),
          "{}",
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

    it("...should destroy a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.destroyCoffeeBatch(1, {
        from: accounts[0]
      });
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogDestroyCoffeeBatch",
        "should be the LogDestroyCoffeeBatch event"
      );
      receipt.logs[0].args._actorAddress.should.be.equal(
        accounts[0],
        "logs the deleted actor farm address"
      );
      receipt.logs[0].args._id
        .toNumber()
        .should.be.equal(1, "logs the deleted actor coffeebatch id");
      const coffeeBatch = await this.tokenInstance.getCoffeeBatchById(1);
      coffeeBatch[0].toNumber().should.equal(0);
      let isException = false;
      try {
        await this.tokenInstance.destroyCoffeeBatch(1, {
          from: accounts[1]
        });
      } catch (err) {
        isException = true;
        assert(err.reason === "require sender to be the owner");
      }
      expect(isException).to.be.equal(
        true,
        "it should revert on not owner of coffee"
      );
    });
  });

  describe("Cooperative Validations", () => {
    before(async () => {
      this.actorTokenInstance = await ActorFactory.deployed();
      await this.actorTokenInstance.addActor(
        web3.utils.utf8ToHex("COOPERATIVE"),
        {
          from: accounts[5]
        }
      );
      await this.actorTokenInstance.addActor(web3.utils.utf8ToHex("FARMER"), {
        from: accounts[6]
      });
      await this.actorTokenInstance.addActor(web3.utils.utf8ToHex("FARMER"), {
        from: accounts[8]
      });
      await this.actorTokenInstance.approve(accounts[5], true, {
        from: accounts[0]
      });
      await this.actorTokenInstance.approve(accounts[5], true, {
        from: accounts[8]
      });
      await this.actorTokenInstance.approve(accounts[6], true, {
        from: accounts[0]
      });
      this.farmTokenInstance = await FarmFactory.deployed();
      await this.farmTokenInstance.addFarm(
        web3.utils.utf8ToHex("Los Encinos 2"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("Santa Lucia 2"),
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: accounts[0] }
      );
    });

    it("...should let a cooperative to add a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.cooperativeAddCoffeeBatch(
        1,
        1200,
        web3.utils.utf8ToHex("Catuai Rojo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        web3.utils.utf8ToHex("Oro"),
        "{}",
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
        "Logs the inserted id"
      );
      expect(receipt.logs[0].args._owner).to.be.equal(
        accounts[0],
        "Logs the inserted owner"
      );
      expect(receipt.logs[0].args._farmId.toNumber()).to.be.equal(
        1,
        "Logs the inserted Farm uid"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1200,
        "Logs the inserted altitude"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._variety)).to.be.equal(
        "Catuai Rojo",
        "Logs the inserted variety"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._process)).to.be.equal(
        "Washed",
        "Logs the inserted process"
      );
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        10000,
        "Logs the inserted size"
      );
      expect(receipt.logs[0].args._cooperativeAddress).to.be.equal(
        accounts[5],
        "Logs the inserted cooperative address"
      );
      expect(
        web3.utils.hexToUtf8(receipt.logs[0].args._coffeeState)
      ).to.be.equal("Oro", "Logs the inserted cooperative address");
      receipt.logs[0].args._additionalInformation.should.be.equal(
        "{}",
        "Logs the inserted additional information"
      );

      let isException = false;
      try {
        await this.tokenInstance.cooperativeAddCoffeeBatch(
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          web3.utils.utf8ToHex("Oro"),
          "{}",
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
          web3.utils.utf8ToHex("Oro"),
          "{},",
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

      isException = false;
      try {
        await this.tokenInstance.cooperativeAddCoffeeBatch(
          5,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          web3.utils.utf8ToHex("Oro"),
          "{}",
          accounts[0],
          { from: accounts[5] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not the owner of the farm");
      }
      isException.should.equal(true, "should revert on the owner of the farm");
    });

    it("...should let a cooperative to update a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.cooperativeUpdateCoffeeBatch(
        2,
        1,
        1300,
        web3.utils.utf8ToHex("Catuai Amarillo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        web3.utils.utf8ToHex("Pergamino"),
        "{1}",
        { from: accounts[5] }
      );
      receipt.logs.length.should.be.equal(1, "triggers one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeUpdateCoffeeBatch",
        "should be the LogCooperativeUpdateCoffeeBatch event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        2,
        "Logs the updated id"
      );
      expect(receipt.logs[0].args._owner).to.be.equal(
        accounts[0],
        "Logs the updated owner"
      );
      expect(receipt.logs[0].args._farmId.toNumber()).to.be.equal(
        1,
        "Logs the updated Farm id"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1300,
        "Logs the updated altitude"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._variety)).to.be.equal(
        "Catuai Amarillo",
        "Logs the updated variety"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._process)).to.be.equal(
        "Washed",
        "Logs the updated process"
      );
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        10000,
        "Logs the updated size"
      );
      expect(
        web3.utils.hexToUtf8(receipt.logs[0].args._coffeeState)
      ).to.be.equal("Pergamino", "Logs the updated process");

      expect(receipt.logs[0].args._additionalInformation).to.be.equal(
        "{1}",
        "Logs the updated process"
      );
      expect(receipt.logs[0].args._cooperativeAddress).to.be.equal(
        accounts[5],
        "Logs the updated cooperative address"
      );

      isException = false;
      try {
        await this.tokenInstance.cooperativeUpdateCoffeeBatch(
          2,
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          web3.utils.utf8ToHex("Oro"),
          "{}",
          { from: accounts[1] }
        );
      } catch (err) {
        console.log("TCL: err", err);
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
          2,
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Amarillo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          web3.utils.utf8ToHex("Oro"),
          "{}",
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

    it("...should allow a cooperative to destroy a Coffee Batch", async () => {
      let isException = false;
      try {
        await this.tokenInstance.cooperativeDestroyCoffeeBatch(2, {
          from: accounts[6]
        });
      } catch (err) {
        isException = true;
        assert(err.reason === "not a cooperative");
      }
      expect(isException).to.be.equal(
        true,
        "it should revert on not a cooperative account"
      );

      const receipt = await this.tokenInstance.cooperativeDestroyCoffeeBatch(
        2,
        {
          from: accounts[5]
        }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeDestroyCoffeeBatch",
        "should be the LogCooperativeDestroyCoffeeBatch event"
      );
      receipt.logs[0].args._cooperativeAddress.should.be.equal(
        accounts[5],
        "logs the cooperative address"
      );
      receipt.logs[0].args._actorAddress.should.be.equal(
        accounts[0],
        "logs the deleted actor coffee batch address"
      );
      expect(receipt.logs[0].args._coffeeBatchId.toNumber()).to.be.equal(
        2,
        "logs the deleted actor coffeeBatch id"
      );
      const coffeeBatch = await this.tokenInstance.getCoffeeBatchById(2);
      coffeeBatch[0].toNumber().should.equal(0);

      isException = false;
      try {
        await this.tokenInstance.cooperativeDestroyCoffeeBatch(2, {
          from: accounts[4]
        });
      } catch (err) {
        isException = true;
        assert(err.reason === "not authorized");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on not allowed account"
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
        await this.tokenInstance.addCoffeeBatch(
          1,
          1200,
          web3.utils.utf8ToHex("Catuai Rojo"),
          web3.utils.utf8ToHex("Washed"),
          10000,
          web3.utils.utf8ToHex("Oro"),
          "{}",
          { from: accounts[0] }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Pausable: paused");
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
