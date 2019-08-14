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

    it("... should destroy an Actor", async () => {
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
  });

  describe("Cooperative Validations", () => {
    it("...should allow a cooperative to add a Farmer", async () => {
      await this.tokenInstance.addActor(
        web3.utils.utf8ToHex("Frederick Tercero"),
        web3.utils.utf8ToHex("cooperative"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("freederick@stark.com"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dui nunc, fermentum id fermentum sit amet, ornare id risus.",
        { from: accounts[5] }
      );
      const receipt = await this.tokenInstance.cooperativeAddActor(
        web3.utils.utf8ToHex("Melvin Zambrano"),
        web3.utils.utf8ToHex("farmer"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("melvin@stark.com"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        accounts[4],
        { from: accounts[5] }
      );
      receipt.logs.length.should.be.equal(2, "trigger two events");
      receipt.logs[0].event.should.be.equal(
        "LogCooperativeAddActor",
        "should be the LogCooperativeAddActor event"
      );
      receipt.logs[1].event.should.be.equal(
        "LogApproval",
        "should be the LogApproval event"
      );
      receipt.logs[0].args._id.should.be.equal(
        accounts[4],
        "logs the inserted actor address"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._name)).to.equal(
        "Melvin Zambrano",
        "logs the inserted name"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._typeOfActor)
        .should.be.equal("farmer", "logs the inserted type of account");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._country)
        .should.be.equal("Honduras", "logs the inserted actor country");

      web3.utils
        .hexToUtf8(receipt.logs[0].args._region)
        .should.be.equal("Francisco Morazan", "logs the inserted actor region");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._email)
        .should.be.equal("melvin@stark.com", "logs the inserted actor email");
      receipt.logs[0].args._imageHash.should.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "logs the inserted actor image"
      );
      receipt.logs[0].args._bio.should.be.equal(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "logs the inserted actor bio"
      );
      receipt.logs[0].args._cooperativeAddress.should.be.equal(
        accounts[5],
        "logs the inserted cooperative address"
      );
      const actorCount = await this.tokenInstance.getActorCount();
      expect(actorCount.toNumber()).to.be.equal(
        3,
        "actors should had incremented"
      );

      let isException = false;

      try {
        await this.tokenInstance.cooperativeAddActor(
          web3.utils.utf8ToHex("Eduardo Garner"),
          web3.utils.utf8ToHex("farmer"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Choluteca"),
          web3.utils.utf8ToHex("tony@stark.com"),
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dui nunc, fermentum id fermentum sit amet, ornare id risus. Pellentesque sit amet pellentesque justo. In sit amet nibh turpis. Sed dictum ornare erat. Ut tempus nulla quis imperdiet accumsan. Ut nec lacus vel neque tincidunt tempus eu in urna. Vivamus in risus a tortor semper suscipit id vitae enim.",
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

      const result = await this.tokenInstance.isAllowed(
        accounts[4],
        accounts[5]
      );
      result.should.be.equal(
        true,
        "it should give permission when creating farmer"
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
        await this.tokenInstance.addActor(
          web3.utils.utf8ToHex("Eduardo Garner"),
          web3.utils.utf8ToHex("farmer"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Choluteca"),
          web3.utils.utf8ToHex("ceegarner@hotmail.com"),
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dui nunc, fermentum id fermentum sit amet, ornare id risus. Pellentesque sit amet pellentesque justo. In sit amet nibh turpis. Sed dictum ornare erat. Ut tempus nulla quis imperdiet accumsan. Ut nec lacus vel neque tincidunt tempus eu in urna. Vivamus in risus a tortor semper suscipit id vitae enim.",
          {
            from: accounts[9]
          }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Contract is paused");
      }
      expect(revert).to.equal(true, "Should revert on paused contract");
      revert = false;
      try {
        await this.tokenInstance.updateActor(
          web3.utils.utf8ToHex("Eduardo Garner"),
          web3.utils.utf8ToHex("taster"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Choluteca"),
          web3.utils.utf8ToHex("ceegarner@hotmail.com"),
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dui nunc, fermentum id fermentum sit amet, ornare id risus. Pellentesque sit amet pellentesque justo. In sit amet nibh turpis. Sed dictum ornare erat. Ut tempus nulla quis imperdiet accumsan. Ut nec lacus vel neque tincidunt tempus eu in urna. Vivamus in risus a tortor semper suscipit id vitae enim.",
          {
            from: accounts[9]
          }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Contract is paused");
      }
      expect(revert).to.equal(true, "Should revert on paused contract");
      revert = false;
      try {
        await this.tokenInstance.approve(accounts[4], true, {
          from: accounts[1]
        });
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
  });

  /*TODO: Refactor everything to another test
  it("...should delete the contract.", async () => {
    await this.tokenInstance.destroy({ from: accounts[0] });
    const code = await web3.eth.getCode(this.tokenInstance.address);
    code.should.equal("0x");
  });*/
});
