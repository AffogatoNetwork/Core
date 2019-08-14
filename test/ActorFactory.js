// ! TODO: add pause tests for all function
require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

var ActorFactory = artifacts.require("./ActorFactory.sol");

contract(ActorFactory, function(accounts) {
  beforeEach(async () => {
    this.tokenInstance = await ActorFactory.deployed();
  });

  describe("Actor Validations", () => {
    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

    it("...should add an Actor", async () => {
      const receipt = await this.tokenInstance.addActor(
        web3.utils.utf8ToHex("FARMER"),
        { from: accounts[1] }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddActor",
        "should be the LogAddActor event"
      );
      receipt.logs[0].args._actorAddress.should.be.equal(
        accounts[1],
        "logs the inserted actor address"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._role)).to.be.equal(
        "FARMER",
        "logs the inserted role"
      );

      var isException = false;
      try {
        await this.tokenInstance.addActor(web3.utils.utf8ToHex("COOPERATIVE"), {
          from: accounts[1]
        });
      } catch (err) {
        isException = true;
        assert(
          err.reason === "actor already exists",
          "Exception reason is not the specified"
        );
      }
      isException.should.be.equal(
        true,
        "should revert on adding same actor address"
      );

      isException = false;
      try {
        await this.tokenInstance.addActor(web3.utils.utf8ToHex("Cooperative"), {
          from: accounts[2]
        });
      } catch (err) {
        isException = true;
        assert(
          err.reason === "invalid role",
          "Exception reason is not the specified"
        );
      }
      isException.should.be.equal(true, "should revert on invalid role");
    });

    it("...should get an account role", async () => {
      const actor = await this.tokenInstance.getAccountType(accounts[1]);
      expect(web3.utils.hexToUtf8(actor)).to.be.equal(
        "FARMER",
        "Role same as inserted"
      );
    });

    it("...should allow actors to approve actors", async () => {
      const receipt = await this.tokenInstance.approve(accounts[3], true, {
        from: accounts[1]
      });
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogApproval",
        "should be the LogApproval event"
      );
      receipt.logs[0].args._owner.should.be.equal(
        accounts[1],
        "logs the owner address"
      );
      receipt.logs[0].args._allowed.should.be.equal(
        accounts[3],
        "logs the allowed address"
      );
      receipt.logs[0].args._value.should.be.true;
    });

    it("Gets allowed", async () => {
      const result = await this.tokenInstance.isAllowed(
        accounts[1],
        accounts[3]
      );
      result.should.be.true;
    });

    it("...should destroy an Actor", async () => {
      const receipt = await this.tokenInstance.destroyActor({
        from: accounts[1]
      });
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogDestroyActor",
        "should be the LogDestroyActor event"
      );
      receipt.logs[0].args._actorAddress.should.be.equal(
        accounts[1],
        "logs the deleted actor address"
      );
      const actor = await this.tokenInstance.actorExists(accounts[1]);
      actor.should.be.false;
    });
  });

  describe("Cooperative Validations", () => {
    before(async () => {
      await this.tokenInstance.addActor(web3.utils.utf8ToHex("COOPERATIVE"), {
        from: accounts[5]
      });
      await this.tokenInstance.addActor(web3.utils.utf8ToHex("FARMER"), {
        from: accounts[8]
      });
    });

    it("...should allow a cooperative to add a Farmer", async () => {
      const receipt = await this.tokenInstance.cooperativeAddActor(
        web3.utils.utf8ToHex("FARMER"),
        accounts[4],
        { from: accounts[5] }
      );
      receipt.logs.length.should.be.equal(2, "trigger two events");
      receipt.logs[1].event.should.be.equal(
        "LogCooperativeAddActor",
        "should be the LogCooperativeAddActor event"
      );
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeApproval",
        "should be the LogCooperativeApproval event"
      );
      receipt.logs[1].args._actorAddress.should.be.equal(
        accounts[4],
        "logs the inserted actor address"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[1].args._role)).to.be.equal(
        "FARMER",
        "logs the inserted role"
      );
      receipt.logs[1].args._cooperativeAddress.should.be.equal(
        accounts[5],
        "logs the inserted cooperative address"
      );

      const result = await this.tokenInstance.isAllowed(
        accounts[4],
        accounts[5]
      );
      result.should.be.equal(
        true,
        "it should give permission when creating farmer"
      );

      let isException = false;
      try {
        await this.tokenInstance.cooperativeAddActor(
          web3.utils.utf8ToHex("FARMER"),
          accounts[6],
          { from: accounts[1] }
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

    it("...should allow a cooperative to add an Allowed", async () => {
      const receipt = await this.tokenInstance.cooperativeApprove(
        accounts[4],
        accounts[6],
        true,
        {
          from: accounts[5]
        }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeApproval",
        "should be the LogCooperativeApproval event"
      );
      receipt.logs[0].args._owner.should.be.equal(
        accounts[4],
        "logs the owner address"
      );
      receipt.logs[0].args._allowed.should.be.equal(
        accounts[6],
        "logs the allowed address"
      );
      receipt.logs[0].args._value.should.be.true;
      receipt.logs[0].args._cooperativeAddress.should.be.equal(
        accounts[5],
        "logs the cooperative address"
      );
      let isException = false;

      try {
        await this.tokenInstance.cooperativeApprove(
          accounts[4],
          accounts[7],
          true,
          {
            from: accounts[6]
          }
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

    it("...should allow a cooperative to destroy an Actor", async () => {
      const receipt = await this.tokenInstance.cooperativeDestroyActor(
        accounts[4],
        {
          from: accounts[5]
        }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeDestroyActor",
        "should be the LogCooperativeDestroyActor event"
      );
      receipt.logs[0].args._cooperativeAddress.should.be.equal(
        accounts[5],
        "logs the cooperative address"
      );
      receipt.logs[0].args._actorAddress.should.be.equal(
        accounts[4],
        "logs the deleted actor address"
      );
      const actor = await this.tokenInstance.actorExists(accounts[4]);
      actor.should.be.false;

      let isException = false;
      try {
        await this.tokenInstance.cooperativeDestroyActor(accounts[4], {
          from: accounts[8]
        });
      } catch (err) {
        isException = true;
        assert(err.reason === "not a cooperative");
      }
      expect(isException).to.be.equal(
        true,
        "it should revert on not a cooperative account"
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
      var isException = false;
      try {
        await this.tokenInstance.pause({
          from: accounts[1]
        });
      } catch (err) {
        isException = true;
        assert(
          err.reason === "PauserRole: caller does not have the Pauser role"
        );
      }
      expect(isException).to.equal(true, "Should revert on no permissions");
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
        await this.tokenInstance.addActor(web3.utils.utf8ToHex("FARMER"), {
          from: accounts[9]
        });
      } catch (err) {
        revert = true;
        assert(err.reason === "Pausable: paused");
      }
      expect(revert).to.equal(true, "Should revert on paused contract");
      revert = false;
      try {
        await this.tokenInstance.approve(accounts[4], true, {
          from: accounts[1]
        });
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
  });

  /*TODO: Refactor everything to another test
  it("...should delete the contract.", async () => {
    await this.tokenInstance.destroy({ from: accounts[0] });
    const code = await web3.eth.getCode(this.tokenInstance.address);
    code.should.equal("0x");
  });*/
});
