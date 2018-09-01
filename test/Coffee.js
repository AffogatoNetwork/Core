require("chai").should();
require("chai").expect;

var Coffee = artifacts.require("./Coffee.sol");

contract(Coffee, accounts => {
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
    this.tokenInstance = await Coffee.deployed();
  });

  describe("Coffee Bacth Validations", () => {
    it("Adds a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.addCoffeeBatch(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        1200,
        "Catuai Rojo",
        "Washed",
        10000,
        { from: accounts[0] }
      );
      receipt.logs.length.should.be.equal(1, "triggers one event");
      receipt.logs[0].event.should.be.equal(
        "LogAddCoffeeBatch",
        "should be the LogAddCoffeeBatch event"
      );
      receipt.logs[0].args._id.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "Logs the inserted uid"
      );
      receipt.logs[0].args._farmUid.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "Logs the inserted Farm uid"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1200,
        "Logs the inserted altitude"
      );
      byteToString(receipt.logs[0].args._variety).should.be.equal(
        "Catuai Rojo",
        "Logs the inserted variety"
      );
      byteToString(receipt.logs[0].args._process).should.be.equal(
        "Washed",
        "Logs the inserted process"
      );
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        10000,
        "Logs the inserted size"
      );
      receipt.logs[0].args._isSold.should.be.false;
      const count = await this.tokenInstance.getFarmCoffeeBatchCount(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      expect(count.toNumber()).to.be.equal(
        1,
        "Coffee Batches for farm should be 1"
      );
    });

    it("Gets a Coffee Batch", async () => {
      const coffeeBatch = await this.tokenInstance.getCoffeeBatchById(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      coffeeBatch[0].should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "batch id is equal to generated"
      );
      coffeeBatch[1].should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "farm uid is equal to inserted"
      );
      expect(coffeeBatch[2].toNumber()).to.be.equal(
        1200,
        "altitude is equal to inserted"
      );
      expect(byteToString(coffeeBatch[3])).to.be.equal(
        "Catuai Rojo",
        "variety is equal to inserted"
      );
      expect(byteToString(coffeeBatch[4])).to.be.equal(
        "Washed",
        "process is equal to inserted"
      );
      expect(coffeeBatch[5].toNumber()).to.be.equal(
        10000,
        "size is equal to inserted"
      );
    });

    it("Updates a Coffee Batch", async () => {
      const receipt = await this.tokenInstance.updateCoffeeBatch(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        1000,
        "Catuai Amarillo",
        "Honey",
        12000,
        { from: accounts[0] }
      );
      receipt.logs.length.should.be.equal(1, "triggers one event");
      receipt.logs[0].event.should.be.equal(
        "LogUpdateCoffeeBatch",
        "should be the LogUpdateCoffeeBatch event"
      );
      receipt.logs[0].args._id.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "Logs the updated uid"
      );
      receipt.logs[0].args._farmUid.should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "Logs the inserted Farm uid"
      );
      expect(receipt.logs[0].args._altitude.toNumber()).to.be.equal(
        1000,
        "Logs the inserted altitude"
      );
      byteToString(receipt.logs[0].args._variety).should.be.equal(
        "Catuai Amarillo",
        "Logs the inserted variety"
      );
      byteToString(receipt.logs[0].args._process).should.be.equal(
        "Honey",
        "Logs the inserted process"
      );
      expect(receipt.logs[0].args._size.toNumber()).to.be.equal(
        12000,
        "Logs the inserted size"
      );
      receipt.logs[0].args._isSold.should.be.false;
      const coffeeBatch = await this.tokenInstance.getCoffeeBatchById(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
      );
      coffeeBatch[0].should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "batch id is equal to original"
      );
      coffeeBatch[1].should.be.equal(
        "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
        "farm uid is equal to updated"
      );
      expect(coffeeBatch[2].toNumber()).to.be.equal(
        1000,
        "altitude is equal to updated"
      );
      expect(byteToString(coffeeBatch[3])).to.be.equal(
        "Catuai Amarillo",
        "variety is equal to updated"
      );
      expect(byteToString(coffeeBatch[4])).to.be.equal(
        "Honey",
        "process is equal to updated"
      );
      expect(coffeeBatch[5].toNumber()).to.be.equal(
        12000,
        "size is equal to inserted"
      );
    });
  });

  /*
  it("Handles Coffee Batch Actions", function() {
    return Coffee.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.getCoffeeBatchAction(0, "creation");
      })
      .then(function(action) {
        assert.equal(action[0], accounts[0], "address is equal to inserted");
        assert.equal(
          byteToString(action[1]),
          "creation",
          "type of action is equal to inserted"
        );
        assert.equal(
          action[2],
          '{"size":"1","symbol":"QQ}',
          "additional information is equal to inserted"
        );
        assert.equal(action[3], timeNow, "time is equal to inserted");
        return tokenInstance.getCoffeeBatchActions(0);
      })
      .then(function(actions) {
        assert.equal(
          byteToString(actions[0]),
          "creation",
          "Current only action is creation"
        );
        timeNow = +new Date();
        return tokenInstance.addCoffeeBatchAction(
          0,
          "depulped",
          '{"size":"0.5","symbol":"QQ}',
          timeNow,
          { from: accounts[0] }
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogAddCoffeeBatchAction",
          'should be the "LogAddCoffeeBatch" event'
        );
        assert.equal(
          receipt.logs[0].args._id.toNumber(),
          0,
          "logs the inserted address id"
        );
        return tokenInstance.getCoffeeBatchActions(0);
      })
      .then(function(actions) {
        assert.equal(
          byteToString(actions[0]),
          "creation",
          "Action is creation"
        );
        assert.equal(
          byteToString(actions[1]),
          "depulped",
          "Action is depulped"
        );
        return tokenInstance.getCoffeeBatchAction(0, "depulped");
      })
      .then(function(action) {
        assert.equal(action[0], accounts[0], "address is equal to inserted");
        assert.equal(
          byteToString(action[1]),
          "depulped",
          "type of action is equal to inserted"
        );
        assert.equal(
          action[2],
          '{"size":"0.5","symbol":"QQ}',
          "additional information is equal to inserted"
        );
        assert.equal(action[3], timeNow, "time is equal to inserted");
      });
  });

  it("Handles Coffee Batch Tasting", function() {
    return Coffee.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        timeNow = +new Date();
        return tokenInstance.addCoffeeBatchTasting(
          0,
          "Floral Dulce",
          "Naranja",
          "Cítrica suave",
          "Cremoso",
          "Floral y entonante",
          "90.0",
          '{"notes":"Bebida agradable al paladar"}',
          timeNow,
          { from: accounts[1] }
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogAddCoffeeBatchTasting",
          'should be the "LogAddCoffeeBatchTasting" event'
        );
        assert.equal(
          receipt.logs[0].args._id.toNumber(),
          0,
          "logs the inserted address id"
        );
        return tokenInstance.getCoffeeBatchTasters(0);
      })
      .then(function(tasters) {
        assert.equal(tasters[0], accounts[1], "taster needs to be the same");
        return tokenInstance.getCoffeeBatchCupProfile(0, tasters[0]);
      })
      .then(function(cupProfile) {
        assert.equal(
          byteToString(cupProfile[0]),
          "Floral Dulce",
          "aroma is equal to inserted"
        );
        assert.equal(
          byteToString(cupProfile[1]),
          "Naranja",
          "flavor is equal to inserted"
        );
        assert.equal(
          byteToString(cupProfile[2]),
          "Cítrica suave",
          "acidity is equal to inserted"
        );
        assert.equal(
          byteToString(cupProfile[3]),
          "Cremoso",
          "body is equal to inserted"
        );
        assert.equal(
          byteToString(cupProfile[4]),
          "Floral y entonante",
          "after taste is equal to inserted"
        );
        assert.equal(
          cupProfile[5],
          "90.0",
          "cupping note is equal to inserted"
        );
        assert.equal(
          cupProfile[6],
          '{"notes":"Bebida agradable al paladar"}',
          "additional Data is equal to inserted"
        );
        assert.equal(cupProfile[7], timeNow, "time is equal to inserted");
        timeNow = +new Date();
        return tokenInstance.addCoffeeBatchTasting(
          0,
          "Floral Dulce",
          "Naranja y mandarina",
          "Cítrica suave",
          "Cremoso",
          "Floral y persistente",
          "92.0",
          '{"notes":"Muy buena"}',
          timeNow,
          { from: accounts[2] }
        );
      })
      .then(function(receipt) {
        return tokenInstance.getCoffeeBatchTastersCount(0);
      })
      .then(function(count) {
        assert.equal(count, 2, "Tasters size increase");
      });
  });

  it("Handles Coffee Batch Certificates", function() {
    return Coffee.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        timeNow = +new Date();
        return tokenInstance.addCoffeeBatchCertificate(
          0,
          "Denominación de origen Marcala",
          '{"notes":"Paso todas las pruebas de catación, análisis de suelo."}',
          timeNow,
          { from: accounts[1] }
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogAddCoffeeBatchCertficate",
          'should be the "LogAddCoffeeBatchCertficate" event'
        );
        assert.equal(
          receipt.logs[0].args._id.toNumber(),
          0,
          "logs the inserted address id"
        );
        return tokenInstance.getCoffeeBatchCertificatesCount(0);
      })
      .then(function(count) {
        assert.equal(count, 1, "certificates number equal to 1");
        return tokenInstance.getCoffeeBatchCertificate(0, 0);
      })
      .then(function(certificate) {
        assert.equal(
          certificate[0],
          accounts[1],
          "address is equal to inserted"
        );
        assert.equal(
          byteToString(certificate[1]),
          "Denominación de origen Marcala",
          "type of certificate is equal to inserted"
        );
        assert.equal(
          certificate[2],
          '{"notes":"Paso todas las pruebas de catación, análisis de suelo."}',
          "additional information is equal to inserted"
        );
        assert.equal(certificate[3], timeNow, "time is equal to inserted");
      });
  });
  */
});
