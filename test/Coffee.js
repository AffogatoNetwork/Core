var Coffee = artifacts.require("./Coffee.sol");

contract(Coffee,function(accounts){
    var tokenInstance;
    var timeNow;
    
    function byteToString(a){
       return trimNull(web3.toAscii(a));
    }

    function trimNull(a) {
        var c = a.indexOf('\0');
        if (c>-1) {
          return a.substr(0, c);
        }
        return a;
    }
	
	it('Adds a Coffee Batch',function(){
		return Coffee.deployed().then(function(instance){
            tokenInstance = instance;
            timeNow = + new Date();
			return tokenInstance.addCoffeeBatch(
                1200, 
                "Catuai Rojo",
                '{"size":"1","symbol":"QQ}',
                timeNow,
                {from: accounts[0]}
            );
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'LogAddCoffeeBatch', 'should be the "LogAddCoffeeBatch" event');
      		assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted address id');
      		return tokenInstance.getCount();
		}).then(function(count){
            assert.equal(1,count,'coffeeBatchIds should had incremented');
            return tokenInstance.coffeeBatches(0);
        }).then(function(coffeeBatch){
            assert.equal(coffeeBatch[0], 0, 'id is equal to inserted');
            assert.equal(coffeeBatch[1].toNumber(),1200, 'altitude is equal to inserted');
            assert.equal(byteToString(coffeeBatch[2]), "Catuai Rojo", 'variety is equal to inserted');
            //Web3 Doesn't support array of structs so they skip it
            assert.equal(coffeeBatch[5], '{"size":"1","symbol":"QQ}');
            return tokenInstance.getCoffeeBatchAction(0,0);
        }).then(function(action){
            assert.equal(action[0], accounts[0], 'address is equal to inserted');
            assert.equal(byteToString(action[1]), "creation", 'type of action is equal to inserted');
            assert.equal(action[2], '{"size":"1","symbol":"QQ}', 'additional information is equal to inserted');
            assert.equal(action[3], timeNow, 'address is equal to inserted');
        });

        //TODO Test change of actor
    });
});