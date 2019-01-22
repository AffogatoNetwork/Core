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
    it("Adds an Actor", async () => {
      const receipt = await this.tokenInstance.addActor(
        web3.utils.utf8ToHex("Toño Stark"),
        web3.utils.utf8ToHex("farmer"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("tony@stark.com"),
        { from: accounts[1] }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddActor",
        "should be the LogAddActor event"
      );
      receipt.logs[0].args._id.should.be.equal(
        accounts[1],
        "logs the inserted actor address"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._name)).to.equal(
        "Toño Stark",
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
        .should.be.equal("tony@stark.com", "logs the inserted actor email");
      const actorCount = await this.tokenInstance.getActorCount();
      expect(actorCount.toNumber()).to.be.equal(
        1,
        "actors should had incremented"
      );
      var revert = true;
      try {
        const receiptFail = await this.tokenInstance.addActor(
          web3.utils.utf8ToHex("Eduardo Garner"),
          web3.utils.utf8ToHex("farmer"),
          web3.utils.utf8ToHex("Honduras"),
          web3.utils.utf8ToHex("Choluteca"),
          web3.utils.utf8ToHex("ceegarner@hotmail.com"),
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
          "should revert on adding same actor address"
        );
      }
    });

    it("Gets an Actor", async () => {
      const actor = await this.tokenInstance.getActor(accounts[1], {
        from: accounts[0]
      });
      expect(web3.utils.hexToUtf8(actor[0])).to.be.equal(
        "Toño Stark",
        "Name same as inserted"
      );
      expect(web3.utils.hexToUtf8(actor[1])).to.be.equal(
        "farmer",
        "Type of Account same as inserted"
      );
      expect(web3.utils.hexToUtf8(actor[2])).to.be.equal(
        "Honduras",
        "Country same as inserted"
      );
      expect(web3.utils.hexToUtf8(actor[3])).to.be.equal(
        "Francisco Morazan",
        "Region same as inserted"
      );
      expect(web3.utils.hexToUtf8(actor[4])).to.be.equal(
        "tony@stark.com",
        "Email same as inserted"
      );
    });

    it("Updates an Actor", async () => {
      const receipt = await this.tokenInstance.updateActor(
        web3.utils.utf8ToHex("Eduardo Garner"),
        web3.utils.utf8ToHex("taster"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Choluteca"),
        web3.utils.utf8ToHex("ceegarner@hotmail.com"),
        {
          from: accounts[1]
        }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogUpdateActor",
        "should be the LogUpdateActor event"
      );
      receipt.logs[0].args._id.should.be.equal(
        accounts[1],
        "logs the updated actor address"
      );
      web3.utils
        .hexToUtf8(receipt.logs[0].args._name)
        .should.be.equal("Eduardo Garner", "logs the updated name");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._typeOfActor)
        .should.be.equal("taster", "logs the updated type of account");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._country)
        .should.be.equal("Honduras", "logs the updated actor country");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._region)
        .should.be.equal("Choluteca", "logs the updated actor region");
      web3.utils
        .hexToUtf8(receipt.logs[0].args._email)
        .should.be.equal(
          "ceegarner@hotmail.com",
          "logs the updated actor email"
        );
      const actor = await this.tokenInstance.getActor(accounts[1], {
        from: accounts[0]
      });
      expect(web3.utils.hexToUtf8(actor[0])).to.be.equal(
        "Eduardo Garner",
        "Name equal to updated"
      );
      expect(web3.utils.hexToUtf8(actor[1])).to.be.equal(
        "taster",
        "ActorType equal to updated"
      );
      expect(web3.utils.hexToUtf8(actor[2])).to.be.equal(
        "Honduras",
        "Country same as updated"
      );
      expect(web3.utils.hexToUtf8(actor[3])).to.be.equal(
        "Choluteca",
        "Region same as updated"
      );
      expect(web3.utils.hexToUtf8(actor[4])).to.be.equal(
        "ceegarner@hotmail.com",
        "Email same as updated"
      );
    });

    it("Validates account ownership", async () => {
      const actor = await this.tokenInstance.returnOwner({
        from: accounts[1]
      });
      expect(web3.utils.hexToUtf8(actor[0])).to.be.equal(
        "Eduardo Garner",
        "It should return the user"
      );
      const actorFail = await this.tokenInstance.returnOwner({
        from: accounts[2]
      });
      expect(web3.utils.hexToUtf8(actorFail[0]), "It shouldn't exist any user")
        .to.be.empty;
    });
  });

  it("Allows actors to approve actors", async () => {
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
    const result = await this.tokenInstance.isAllowed(accounts[1], accounts[3]);
    result.should.be.true;
  });
});
