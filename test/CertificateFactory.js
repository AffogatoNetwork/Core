require("chai").should();
require("chai").expect;
var BN = web3.utils.BN;
require("chai").use(require("chai-bignumber")(BN));

var CertificateFactory = artifacts.require("./CertificateFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");
var FarmFactory = artifacts.require("./FarmFactory.sol");
var CoffeeBatchFactory = artifacts.require("./CoffeeBatchFactory");

contract(CertificateFactory, function(accounts) {
  beforeEach(async () => {
    this.tokenInstance = await CertificateFactory.deployed();
  });

  describe("Certificate Validations", () => {
    before(async () => {
      this.actorTokenInstance = await ActorFactory.deployed();
      this.farmTokenInstance = await FarmFactory.deployed();
      this.coffeeBatchTokenInstance = await CoffeeBatchFactory.deployed();
      await this.actorTokenInstance.addActor(web3.utils.utf8ToHex("FARMER"), {
        from: accounts[1]
      });
      await this.actorTokenInstance.addActor(
        web3.utils.utf8ToHex("CERTIFIER"),
        {
          from: accounts[4]
        }
      );
      await this.actorTokenInstance.approve(accounts[4], true, {
        from: accounts[1]
      });
      await this.farmTokenInstance.addFarm(
        web3.utils.utf8ToHex("Los Encinos"),
        web3.utils.utf8ToHex("Honduras"),
        web3.utils.utf8ToHex("Francisco Morazan"),
        web3.utils.utf8ToHex("Santa Lucia"),
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        { from: accounts[1] }
      );
      await this.coffeeBatchTokenInstance.addCoffeeBatch(
        1,
        1200,
        web3.utils.utf8ToHex("Catuai Rojo"),
        web3.utils.utf8ToHex("Washed"),
        10000,
        web3.utils.utf8ToHex("Oro"),
        "{}",
        { from: accounts[1] }
      );
    });

    it("...should set an owner.", async () => {
      var owner = await this.tokenInstance.owner();
      owner.should.be.equal(accounts[0]);
    });

    it("Adds a certificate", async () => {
      const receipt = await this.tokenInstance.addCertificate(
        web3.utils.utf8ToHex("DO Marcala"),
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Denominación de Origen de Marcala",
        "",
        {
          from: accounts[4]
        }
      );

      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddCertificate",
        "should be the LogAddCertificate event"
      );
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "logs the added certificate id"
      );

      receipt.logs[0].args._certifierAddress.should.be.equal(
        accounts[4],
        "logs the added certificate certifier address"
      );
      expect(web3.utils.hexToUtf8(receipt.logs[0].args._name)).to.be.equal(
        "DO Marcala",
        "logs the added certificate name"
      );
      expect(receipt.logs[0].args._imageHash).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "logs the added certificate image hash"
      );
      expect(receipt.logs[0].args._description).to.be.equal(
        "Denominación de Origen de Marcala",
        "logs the added certificate Description"
      );
      expect(receipt.logs[0].args._additionalInformation).to.be.equal(
        "",
        "logs the added certificate Additional information"
      );

      const countCertificates = await this.tokenInstance.getCertifierCertificateCount(
        accounts[4]
      );
      expect(countCertificates.toNumber()).to.be.equal(
        1,
        "Taster Profiles counter should increase"
      );
    });

    it("Assigns a certificate", async () => {
      const receipt = await this.tokenInstance.assignCertificate(
        accounts[1],
        1,
        1,
        {
          from: accounts[4]
        }
      );

      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogAssignCertificate",
        "should be the LogAssignCertificate event"
      );
      expect(receipt.logs[0].args._certificateId.toNumber()).to.be.equal(
        1,
        "logs the assigned certificate id"
      );
      expect(receipt.logs[0].args._coffeeBatchId.toNumber()).to.be.equal(
        1,
        "logs the added certificate coffee batch id"
      );
      receipt.logs[0].args._farmerAddress.should.be.equal(
        accounts[1],
        "logs the added certificate owner address"
      );
      receipt.logs[0].args._certifierAddress.should.be.equal(
        accounts[4],
        "logs the added certificate certifier address"
      );
      let isException = false;
      try {
        const receiptFail = await this.tokenInstance.assignCertificate(
          accounts[1],
          1,
          1,
          { from: accounts[5] }
        );
      } catch (err) {
        isException = true;
        assert(err.reason === "not authorized");
      }

      expect(isException).to.be.equal(
        true,
        "it should revert on not allowed account"
      );
    });

    it("Gets a certificate", async () => {
      const certificate = await this.tokenInstance.getCertificateById(1);
      expect(certificate[0].toNumber()).to.be.equal(1);
      expect(web3.utils.hexToUtf8(certificate[1])).to.be.equal(
        "DO Marcala",
        "Value is equal to inserted"
      );
      expect(certificate[2]).to.be.equal(
        "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
        "Value is equal to inserted"
      );
      expect(certificate[3]).to.be.equal(
        "Denominación de Origen de Marcala",
        "Value is equal to inserted"
      );
      expect(certificate[4]).to.be.equal("", "Value is equal to inserted");
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
        await this.tokenInstance.addCertificate(
          web3.utils.utf8ToHex("DO Marcala"),
          "QmarHSr9aSNaPSR6G9KFPbuLV9aEqJfTk1y9B8pdwqK4Rq",
          "Denominación de Origen de Marcala",
          "",
          {
            from: accounts[4]
          }
        );
      } catch (err) {
        revert = true;
        assert(err.reason === "Pausable: paused");
      }
      expect(revert).to.equal(true, "Should revert on paused contract");
      revert = false;
      try {
        await this.tokenInstance.assignCertificate(accounts[1], 1, 1, {
          from: accounts[4]
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

    /*TODO: Refactor everything to another test
    it("...should delete the contract.", async () => {
      await this.tokenInstance.destroy({ from: accounts[0] });
      const code = await web3.eth.getCode(this.tokenInstance.address);
      code.should.equal("0x");
    });*/
  });
});
