var Actor = artifacts.require("./Actor.sol");

contract(Actor, function(accounts) {
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

  it("Adds a Processor", function() {
    return Actor.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.addProcessor(
          accounts[1],
          "Cafetano",
          "Taster",
          "Francisco Morazan",
          "Honduras",
          141058776000,
          -871768649000,
          '{"story":"Tostaduría de Café Especial, donde se sirve el mejor café de la ciudad.","experience":"Specialty Coffee Association of America Certificate","website":"https://www.facebook.com/cafetanohn/"}'
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogAddProcessor",
          'should be the "LogAddProcessor" event'
        );
        assert.equal(
          receipt.logs[0].args._id.toNumber(),
          0,
          "logs the inserted address id"
        );
        return tokenInstance.getCount();
      })
      .then(function(count) {
        assert.equal(1, count, "processorsIds should had incremented");
        return tokenInstance.addressToProcessor(accounts[1], {
          from: accounts[0]
        });
      })
      .then(function(processor) {
        assert.equal(processor[0], accounts[1], "account is equal to inserted");
        assert.equal(
          byteToString(processor[1]),
          "Cafetano",
          "name is equal to inserted"
        );
        assert.equal(
          byteToString(processor[2]),
          "Taster",
          "type is equal to inserted"
        );
        assert.equal(
          byteToString(processor[3]),
          "Francisco Morazan",
          "department is equal to inserted"
        );
        assert.equal(
          byteToString(processor[4]),
          "Honduras",
          "country is equal to inserted"
        );
        assert.equal(processor[5], 141058776000, "lat is equal to inserted");
        assert.equal(processor[6], -871768649000, "lon is equal to inserted");
        assert.equal(
          processor[7],
          '{"story":"Tostaduría de Café Especial, donde se sirve el mejor café de la ciudad.","experience":"Specialty Coffee Association of America Certificate","website":"https://www.facebook.com/cafetanohn/"}'
        );
      });
  });

  it("Validates account ownership", function() {
    return Actor.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.isAccountOwner.call({ from: accounts[1] });
      })
      .then(function(processor) {
        assert.equal(
          byteToString(processor[0]),
          "Cafetano",
          "name is equal to inserted"
        );
        assert.equal(
          byteToString(processor[1]),
          "Taster",
          "type is equal to inserted"
        );
        assert.equal(
          byteToString(processor[2]),
          "Francisco Morazan",
          "department is equal to inserted"
        );
        assert.equal(
          byteToString(processor[3]),
          "Honduras",
          "country is equal to inserted"
        );
        assert.equal(processor[4], 141058776000, "lat is equal to inserted");
        assert.equal(processor[5], -871768649000, "lon is equal to inserted");
        assert.equal(
          processor[6],
          '{"story":"Tostaduría de Café Especial, donde se sirve el mejor café de la ciudad.","experience":"Specialty Coffee Association of America Certificate","website":"https://www.facebook.com/cafetanohn/"}'
        );
      });
  });

  it("Updates a Processor", function() {
    return Actor.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.updateProcessor(
          accounts[1],
          "Cafetano",
          "Coffee Shop",
          "Francisco Morazan",
          "Honduras",
          141058776000,
          -871768649000,
          '{"story":"Tostaduría de Café Especial, donde se sirve el mejor café de la ciudad.","experience":"Specialty Coffee Association of America Certificate","website":"https://www.facebook.com/cafetanohn/"}'
        );
      })
      .then(function(receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "LogUpdateProcessor",
          'should be the "LogUpdateProcessor" event'
        );
        assert.equal(
          receipt.logs[0].args._id.toNumber(),
          0,
          "logs the inserted address id"
        );
        return tokenInstance.getCount();
      })
      .then(function(count) {
        assert.equal(1, count, "processorsIds should still be the same");
        return tokenInstance.addressToProcessor(accounts[1]);
      })
      .then(function(processor) {
        assert.equal(processor[0], accounts[1], "account is equal to inserted");
        assert.equal(
          byteToString(processor[1]),
          "Cafetano",
          "name is equal to inserted"
        );
        assert.equal(
          byteToString(processor[2]),
          "Coffee Shop",
          "type is equal to inserted"
        );
        assert.equal(
          byteToString(processor[3]),
          "Francisco Morazan",
          "department is equal to inserted"
        );
        assert.equal(
          byteToString(processor[4]),
          "Honduras",
          "country is equal to inserted"
        );
        assert.equal(processor[5], 141058776000, "lat is equal to inserted");
        assert.equal(processor[6], -871768649000, "lon is equal to inserted");
        assert.equal(
          processor[7],
          '{"story":"Tostaduría de Café Especial, donde se sirve el mejor café de la ciudad.","experience":"Specialty Coffee Association of America Certificate","website":"https://www.facebook.com/cafetanohn/"}'
        );
      });
  });

  it("Adds a farm ", function() {
    return Actor.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance
        .addFarm(
          "Los Encinos",
          "Honduras",
          "Francisco Morazan",
          "Santa Lucia",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          "{}"
        )
        .then(function(receipt) {
          assert.equal(receipt.logs.length, 1, "triggers one event");
          assert.equal(
            receipt.logs[0].event,
            "LogAddFarm",
            'should be the "LogAddFarm" event'
          );
          assert.equal(
            receipt.logs[0].args._id.toNumber(),
            0,
            "logs the inserted farm id"
          );
          return tokenInstance.getFarm.call(accounts[0], 0);
        })
        .then(function(farm) {
          assert.equal(
            byteToString(farm[0]),
            "Los Encinos",
            "name equal to inserted"
          );
          assert.equal(
            byteToString(farm[1]),
            "Honduras",
            "country equal to inserted"
          );
          assert.equal(
            byteToString(farm[2]),
            "Francisco Morazan",
            "department equal to inserted"
          );
          assert.equal(
            byteToString(farm[3]),
            "Santa Lucia",
            "village equal to inserted"
          );
          assert.equal(
            farm[4],
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "story equal to inserted"
          );
          assert.equal(
            farm[5],
            "{}",
            "Additional Information equal to inserted"
          );
        });
    });
  });

  it("Updates farm ", function() {
    return Actor.deployed()
      .then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.updateFarm(
          accounts[0],
          0,
          "Los Encinos 2",
          "Honduras 2",
          "Francisco Morazan 2",
          "Santa Lucia 2",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
          "{}"
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
          receipt.logs[0].args._id.toNumber(),
          0,
          "logs the updated farm id"
        );
        return tokenInstance.getFarm.call(accounts[0], 0);
      })
      .then(function(farm) {
        assert.equal(
          byteToString(farm[0]),
          "Los Encinos 2",
          "name equal to inserted"
        );
        assert.equal(
          byteToString(farm[1]),
          "Honduras 2",
          "country equal to inserted"
        );
        assert.equal(
          byteToString(farm[2]),
          "Francisco Morazan 2",
          "department equal to inserted"
        );
        assert.equal(
          byteToString(farm[3]),
          "Santa Lucia 2",
          "village equal to inserted"
        );
        assert.equal(
          farm[4],
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 2",
          "story equal to inserted"
        );
        assert.equal(farm[5], "{}", "Additional Information equal to inserted");
      });
  });
});
