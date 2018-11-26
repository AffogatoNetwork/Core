require("chai").should();
require("chai").expect;

//test

var Marketplace = artifacts.require("../marketplace/Marketplace.sol");

contract(Marketplace, function(accounts) {
  beforeEach(async () => {
    this.tokenInstance = await Marketplace.deployed();
  });

  describe("Marketplace validations", () => {
    it("Creates a Bid", async () => {
      const receipt = await this.tokenInstance.createBid(
        "My Coffee Title",
        "QmZJRzYHrPxQxEwyHpXrDtBta833VDpREDXTq5zK5e3bYx",
        1000000000000000000,
        2000000000000000000,
        1,
        2551403850,
        { from: accounts[1] }
      );
      await this.tokenInstance.createBid(
        "My Coffee Title",
        "QmZJRzYHrPxQxEwyHpXrDtBta833VDpREDXTq5zK5e3bYx",
        1000000000000000000,
        2000000000000000000,
        1,
        1480194713,
        { from: accounts[1] }
      );
      receipt.logs.length.should.be.equal(1, "trigger one event");
      receipt.logs[0].event.should.be.equal(
        "LogCreateBid",
        "should be the LogCreateBid event"
      );
      expect(receipt.logs[0].args._bidPosition.toNumber()).to.be.equal(
        0,
        "Bid position should equal to inserted value"
      );
      receipt.logs[0].args._farmer.should.be.equal(
        accounts[1],
        "Farmer address should equal to inserted value"
      );
      receipt.logs[0].args._title.should.be.equal(
        "My Coffee Title",
        "Title should equal to inserted value"
      );
      receipt.logs[0].args._imageHash.should.be.equal(
        "QmZJRzYHrPxQxEwyHpXrDtBta833VDpREDXTq5zK5e3bYx",
        "Image Hash should equal to inserted value"
      );
      expect(receipt.logs[0].args._initialPrice.toNumber()).to.be.equal(
        1000000000000000000,
        "Initial price should equal to inserted value"
      );
      expect(receipt.logs[0].args._buyoutPrice.toNumber()).to.be.equal(
        2000000000000000000,
        "Buyout should equal to inserted value"
      );
      expect(receipt.logs[0].args._coffeeBatchId.toNumber()).to.be.equal(
        1,
        "Coffee batch id should equal to inserted value"
      );
      expect(receipt.logs[0].args._timeLimit.toNumber()).to.be.equal(
        2551403850,
        "Time limit should equal to inserted value"
      );
    });

    it("Gets a Bid", async () => {
      const bid = await this.tokenInstance.getBid(accounts[1], 0);
      bid[0].should.be.equal(accounts[1], "equal to inserted address");
      bid[1].should.be.equal("My Coffee Title", "equal to inserted title");
      bid[2].should.be.equal(
        "QmZJRzYHrPxQxEwyHpXrDtBta833VDpREDXTq5zK5e3bYx",
        "equal to inserted image hash"
      );
      expect(bid[3].toNumber()).to.be.equal(
        1000000000000000000,
        "equal to inserted initialPrice"
      );
      expect(bid[4].toNumber()).to.be.equal(
        2000000000000000000,
        "equal to inserted buyoutPrice"
      );
      expect(bid[5].toNumber()).to.be.equal(
        1,
        "equal to inserted coffeeBatchId"
      );
      expect(bid[6].toNumber()).to.be.equal(
        2551403850,
        "equal to inserted timeLimit"
      );
      bid[7].should.be.equal(true, "equal to inserted status");
    });

    it("Should not place a Bid if the bid is less than the current bid", async () => {
      try{
        await this.tokenInstance.placeBid(accounts[1], 0, {
          from: accounts[0],
          value: 15000000000000000
        });
        expect(false);
      }catch(error){
        expect(true);
      }
    });
    it("Should not place a Bid if the bid is over", async () => {
      try{
        await this.tokenInstance.placeBid(accounts[1], 1, {
          from: accounts[0],
          value: 15000000000000000000
        });
        expect(false);
      }catch(error){
        expect(true);
      }
    });
    it("Place a Bid with the buyer price less than buyout price", async () => {
      await this.tokenInstance.placeBid(accounts[1], 0, {
        from: accounts[0],
        value: 1500000000000000000
      });
      const bid = await this.tokenInstance.getBid(accounts[1], 0);
      bid[8].should.be.equal(accounts[0]);
      bid[7].should.be.equal(true);
    });
    it("Place a Bid with the buyer price greater than or equal to buyout price", async () => {
      await this.tokenInstance.placeBid(accounts[1], 0, {
        from: accounts[0],
        value: 2000000000000000000
      });
      const bid = await this.tokenInstance.getBid(accounts[1], 0);
      bid[8].should.be.equal(accounts[0]);
      bid[7].should.be.equal(false);
    });
  });
});
