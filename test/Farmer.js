var Farmer = artifacts.require("./Farmer.sol");

contract(Farmer, function(accounts) {
  var tokenInstance;

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

  it("Adds a Farmer", function() {
    return Farmer.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.addFarmer(
          "Cristian Espinoza",
          "Honduras",
          "Francisco Morazan",
          "ceegarner@gmail.com",
          {
            from: accounts[1]
          }
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogAddActor",
          'should be the "LogAddActor" event'
        );
        assert.equal(
          receipt.logs[0].args._id,
          accounts[1],
          "logs the inserted farmer address"
        );
        return tokenInstance.getActorCount();
      })
      .then(function(count) {
        assert.equal(count.toNumber(), 1, "farmers should had incremented");
        return tokenInstance.getFarmer(accounts[1], {
          from: accounts[0]
        });
      })
      .then(function(farmer) {
        assert.equal(
          byteToString(farmer[0]),
          "Cristian Espinoza",
          "name is equal to inserted"
        );
        assert.equal(
          byteToString(farmer[1]),
          "Honduras",
          "Country is equal to inserted"
        );
        assert.equal(
          byteToString(farmer[2]),
          "Francisco Morazan",
          "Region is equal to inserted"
        );
        assert.equal(
          byteToString(farmer[3]),
          "ceegarner@gmail.com",
          "Email is equal to inserted"
        );
        return tokenInstance.addFarmer(
          "Eduardo Garner",
          "Honduras",
          "Francisco Morazan",
          "ceegarner@yahoo.com",
          {
            from: accounts[1]
          }
        );
      })
      .catch(function(receipt) {
        return tokenInstance.getActorCount();
      })
      .then(function(count) {
        assert(count.toNumber(), 1, "count should still be 1");
      });
  });

  it("Updates a farmer", function() {
    return Farmer.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.updateFarmer(
          "Cristian Espinoza",
          "Honduras",
          "Francisco Morazan",
          "ceegarner@hotmail.com",
          {
            from: accounts[1]
          }
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogUpdateActor",
          'should be the "LogUpdateActor" event'
        );
        assert.equal(
          receipt.logs[0].args._id,
          accounts[1],
          "logs the updated farmer address"
        );
        return tokenInstance.getActorCount();
      })
      .then(function(count) {
        assert.equal(count.toNumber(), 1, "farmers should still be the same");
        return tokenInstance.getFarmer(accounts[1]);
      })
      .then(function(farmer) {
        assert.equal(
          byteToString(farmer[0]),
          "Cristian Espinoza",
          "name is equal to inserted"
        );
        assert.equal(
          byteToString(farmer[1]),
          "Honduras",
          "Country is equal to inserted"
        );
        assert.equal(
          byteToString(farmer[2]),
          "Francisco Morazan",
          "Region is equal to inserted"
        );
        assert.equal(
          byteToString(farmer[3]),
          "ceegarner@hotmail.com",
          "Email is equal to inserted"
        );
      });
  });

  it("Validates account ownership", function() {
    return Farmer.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.returnOwner.call({ from: accounts[1] });
      })
      .then(function(farmer) {
        assert.equal(
          byteToString(farmer[0]),
          "Cristian Espinoza",
          "name is equal to inserted"
        );
      });
  });

  it("Adds a farm ", function() {
    return Farmer.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance
        .addFarm(
          "Los Encinos",
          "Honduras",
          "Francisco Morazan",
          "Santa Lucia",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        )
        .then(function(receipt) {
          assert.equal(receipt.logs.length, 1, "triggers one event");
          assert.equal(
            receipt.logs[0].event,
            "LogAddFarm",
            'should be the "LogAddFarm" event'
          );
          assert.equal(
            receipt.logs[0].args._id,
            "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
            "logs the inserted farm id"
          );
          return tokenInstance.getFarmersFarmsCount(accounts[0]);
        })
        .then(function(count) {
          assert.equal(
            count.toNumber(),
            1,
            "Number of farms a farmer has must be equal to added"
          );
          return tokenInstance.getFarmById(
            "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
          );
        })
        .then(function(farm) {
          assert.equal(
            farm[0],
            "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
            "Uid equal to inserted"
          );
          assert.equal(
            byteToString(farm[1]),
            "Los Encinos",
            "name equal to inserted"
          );
          assert.equal(
            byteToString(farm[2]),
            "Honduras",
            "country equal to inserted"
          );
          assert.equal(
            byteToString(farm[3]),
            "Francisco Morazan",
            "department equal to inserted"
          );
          assert.equal(
            byteToString(farm[4]),
            "Santa Lucia",
            "village equal to inserted"
          );
          assert.equal(
            farm[5],
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "story equal to inserted"
          );
        });
    });
  });

  it("Updates farm ", function() {
    return Farmer.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.updateFarm(
          "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
          "Los Encinos 2",
          "Honduras 2",
          "Francisco Morazan 2",
          "Santa Lucia 2",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2"
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogUpdateFarm",
          'should be the "LogUpdateFarm" event'
        );
        assert.equal(
          receipt.logs[0].args._id,
          "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563",
          "logs the updated farm id"
        );
        return tokenInstance.getFarmById.call(
          "0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563"
        );
      })
      .then(function(farm) {
        assert.equal(
          byteToString(farm[1]),
          "Los Encinos 2",
          "name equal to inserted"
        );
        assert.equal(
          byteToString(farm[2]),
          "Honduras 2",
          "country equal to inserted"
        );
        assert.equal(
          byteToString(farm[3]),
          "Francisco Morazan 2",
          "department equal to inserted"
        );
        assert.equal(
          byteToString(farm[4]),
          "Santa Lucia 2",
          "village equal to inserted"
        );
        assert.equal(
          farm[5],
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
          "story equal to inserted"
        );
        return tokenInstance.getFarmersFarmsCount(accounts[0]);
      })
      .then(function(count) {
        assert.equal(count, 1, "farm numbers should be still 1");
      });
  });
});
