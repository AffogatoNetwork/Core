require("chai").should();
require("chai").expect;

var CertificateFactory = artifacts.require("./CertificateFactory.sol");
var ActorFactory = artifacts.require("./ActorFactory.sol");

contract(CertificateFactory, function(accounts) {
  function byteToString(a) {
    return trimNull(web3.toUtf8(a));
  }

  function trimNull(a) {
    var c = a.indexOf("\0");
    if (c > -1) {
      return a.substr(0, c);
    }
    return a;
  }

  beforeEach(async () => {
    this.actorTokenInstance = await ActorFactory.deployed();
    this.tokenInstance = await CertificateFactory.deployed();
    const allowed = await this.actorTokenInstance.approve(accounts[4], true, {
      from: accounts[1]
    });
  });

  describe("Certificate Validations", () => {
    it("Runs the constructor ", async () => {});

    it("Adds a certificate", async () => {
      const receipt = await this.tokenInstance.addCertificate(
        "DO Marcala",
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
      expect(byteToString(receipt.logs[0].args._name)).to.be.equal(
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
      receipt.logs[0].args._ownerAddress.should.be.equal(
        accounts[1],
        "logs the added certificate owner address"
      );
      receipt.logs[0].args._certifierAddress.should.be.equal(
        accounts[4],
        "logs the added certificate certifier address"
      );

      try {
        var result = true;
        const receiptFail = await this.tokenInstance.assignCertificate(
          accounts[1],
          1,
          1,
          { from: accounts[5] }
        );
      } catch (error) {
        result = false;
      }
      if (result) {
        expect(result).to.be.equal(
          false,
          "it should revert on not allowed account"
        );
      }
    });

    /*
    it("Gets a cup profile", async () => {
      const cupProfile = await this.tokenInstance.getCupProfileById(1);
      expect(cupProfile[0].toNumber()).to.be.equal(1);
      expect(byteToString(cupProfile[1])).to.be.equal(
        "Caramelo",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[2])).to.be.equal(
        "Cítrico",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[3])).to.be.equal(
        "balanceada",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[4])).to.be.equal(
        "balanceado",
        "Value is equal to inserted"
      );
      expect(byteToString(cupProfile[5])).to.be.equal(
        "seco",
        "Value is equal to inserted"
      );
      expect(cupProfile[6].toNumber()).to.be.equal(
        8000,
        "Value is equal to inserted"
      );
    });

    it("Updates a cup profile", async () => {
      const receipt = await this.tokenInstance.updateCupProfileById(
        1,
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
      expect(receipt.logs[0].args._id.toNumber()).to.be.equal(
        1,
        "logs the updated cup profile id"
      );

      const cupProfile = await this.tokenInstance.getCupProfileById(1);

      expect(byteToString(cupProfile[1])).to.be.equal(
        "Rosas",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[2])).to.be.equal(
        "Citrico 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[3])).to.be.equal(
        "balanceada 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[4])).to.be.equal(
        "balanceado 2",
        "Value is equal to updated"
      );
      expect(byteToString(cupProfile[5])).to.be.equal(
        "Prolongado 2",
        "Value is equal to updated"
      );
      expect(cupProfile[6].toNumber()).to.be.equal(
        9000,
        "Value is equal to updated"
      );
    });*/
  });
});
