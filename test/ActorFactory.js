require("chai").should();
require("chai").expect;

var ActorFactory = artifacts.require("./ActorFactory.sol");

contract(ActorFactory, function(accounts) {
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
    this.tokenInstance = await ActorFactory.deployed();
  });

  describe("Actor Validations", () => {
    it("Adds an Actor", async () => {
      const receipt = await this.tokenInstance.addActor(
        "Toño Stark",
        "farmer",
        "Honduras",
        "Francisco Morazan",
        "tony@stark.com",
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
      byteToString(receipt.logs[0].args._name).should.be.equal(
        "Toño Stark",
        "logs the inserted name"
      );
      byteToString(receipt.logs[0].args._typeOfActor).should.be.equal(
        "farmer",
        "logs the inserted type of account"
      );
      byteToString(receipt.logs[0].args._country).should.be.equal(
        "Honduras",
        "logs the inserted actor country"
      );

      byteToString(receipt.logs[0].args._region).should.be.equal(
        "Francisco Morazan",
        "logs the inserted actor region"
      );
      byteToString(receipt.logs[0].args._email).should.be.equal(
        "tony@stark.com",
        "logs the inserted actor email"
      );
      const actorCount = await this.tokenInstance.getActorCount();
      expect(actorCount.toNumber()).to.be.equal(
        1,
        "actors should had incremented"
      );
      var revert = true;
      try {
        const receiptFail = await this.tokenInstance.addActor(
          "Eduardo Garner",
          "farmer",
          "Honduras",
          "Choluteca",
          "ceegarner@hotmail.com",
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
      expect(byteToString(actor[0])).to.be.equal(
        "Toño Stark",
        "Name same as inserted"
      );
      expect(byteToString(actor[1])).to.be.equal(
        "farmer",
        "Type of Account same as inserted"
      );
      expect(byteToString(actor[2])).to.be.equal(
        "Honduras",
        "Country same as inserted"
      );
      expect(byteToString(actor[3])).to.be.equal(
        "Francisco Morazan",
        "Region same as inserted"
      );
      expect(byteToString(actor[4])).to.be.equal(
        "tony@stark.com",
        "Email same as inserted"
      );
    });

    it("Updates an Actor", async () => {
      const receipt = await this.tokenInstance.updateActor(
        "Eduardo Garner",
        "taster",
        "Honduras",
        "Choluteca",
        "ceegarner@hotmail.com",
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
      byteToString(receipt.logs[0].args._name).should.be.equal(
        "Eduardo Garner",
        "logs the updated name"
      );
      byteToString(receipt.logs[0].args._typeOfActor).should.be.equal(
        "taster",
        "logs the updated type of account"
      );
      byteToString(receipt.logs[0].args._country).should.be.equal(
        "Honduras",
        "logs the updated actor country"
      );
      byteToString(receipt.logs[0].args._region).should.be.equal(
        "Choluteca",
        "logs the updated actor region"
      );
      byteToString(receipt.logs[0].args._email).should.be.equal(
        "ceegarner@hotmail.com",
        "logs the updated actor email"
      );
      const actor = await this.tokenInstance.getActor(accounts[1], {
        from: accounts[0]
      });
      expect(byteToString(actor[0])).to.be.equal(
        "Eduardo Garner",
        "Name equal to updated"
      );
      expect(byteToString(actor[1])).to.be.equal(
        "taster",
        "ActorType equal to updated"
      );
      expect(byteToString(actor[2])).to.be.equal(
        "Honduras",
        "Country same as updated"
      );
      expect(byteToString(actor[3])).to.be.equal(
        "Choluteca",
        "Region same as updated"
      );
      expect(byteToString(actor[4])).to.be.equal(
        "ceegarner@hotmail.com",
        "Email same as updated"
      );
    });

    it("Validates account ownership", async () => {
      const actor = await this.tokenInstance.returnOwner({
        from: accounts[1]
      });
      expect(byteToString(actor[0])).to.be.equal(
        "Eduardo Garner",
        "It should return the user"
      );
      const actorFail = await this.tokenInstance.returnOwner({
        from: accounts[2]
      });
      expect(byteToString(actorFail[0]), "It shouldn't exist any user").to.be
        .empty;
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
    receipt.logs[0].args._taster.should.be.equal(
      accounts[3],
      "logs the target address"
    );
    receipt.logs[0].args._value.should.be.true;
  });

  it("Gets allowed", async () => {
    const result = await this.tokenInstance.isAllowed(accounts[1], accounts[3]);
    result.should.be.true;
  });
});

/*var Actor = artifacts.require("./Actor.sol");

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
          return tokenInstance.getProcessorFarmsCount.call(accounts[0]);
        })
        .then(function(count) {
          assert.equal(
            count.toNumber(),
            1,
            "Number of farms for processor must be equal to added"
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
*/
