require("chai").should();
require("chai").expect;

var Taster = artifacts.require("./Taster.sol");

contract(Taster, function(accounts) {
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

  beforeEach(async () => {
    this.tokenInstance = await Taster.deployed();
  });

  describe("Taster Validations", () => {
    it("Adds a Taster", async () => {});

    it("Gets a Taster", async () => {});

    it("Updates a Taster", async () => {});

    it("Validates account ownership", async () => {});
  });

  describe("Tasting Validations", () => {
    it("Adds a tasting", async () => {});

    it("Gets a tasting", async () => {});

    it("Updates a tasting", async () => {});
  });
});
