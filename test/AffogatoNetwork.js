var AffogatoNetwork = artifacts.require("./AffogatoNetwork.sol");

contract(AffogatoNetwork,function(accounts){
	var tokenInstance;
	it('Initializes the contract with the correct values',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.count();
		}).then(function(count){
			assert.equal(count,0,"Count is initialized with 0");
		});
	});

	it('Inserts Coffee Batch',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.addCoffeeBatch(571, "93.43", "Fabio Antonio Caballero Martinez", "San Francisco", "San Francisco", "Marcala", "La Paz", "Honduras", "11.7", 1350, "Lavado", "Geisha Emperador");
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'AddCoffeeBatch', 'should be the "AddCoffeeBatch" event');
      		assert.equal(receipt.logs[0].args._id, 0, 'logs the inserted batch id');
      		return tokenInstance.count();
		}).then(function(count){
			assert.equal(count,1,"Count should increase");
		});
	});
});