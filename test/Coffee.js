var Coffee = artifacts.require("./Coffee.sol");

contract(Coffee,function(accounts){
    var tokenInstance;
    var timeNow;
    
    function byteToString(a){
       return trimNull(web3.toUtf8(a));
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
        });
    });

    it('It handles Coffee Batch Actions',function(){
        return Coffee.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.getCoffeeBatchAction(0,"creation");
        }).then(function(action){
            assert.equal(action[0], accounts[0], 'address is equal to inserted');
            assert.equal(byteToString(action[1]), "creation", 'type of action is equal to inserted');
            assert.equal(action[2], '{"size":"1","symbol":"QQ}', 'additional information is equal to inserted');
            assert.equal(action[3], timeNow, 'time is equal to inserted');
            return tokenInstance.getCoffeeBatchActions(0);
        }).then(function(actions){
            assert.equal(byteToString(actions[0]), "creation", 'Current only action is creation');
            timeNow = + new Date();
            return tokenInstance.addCoffeeBatchAction(0,"depulped",'{"size":"0.5","symbol":"QQ}',timeNow,{from: accounts[0]});
        }).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'LogAddCoffeeBatchAction', 'should be the "LogAddCoffeeBatch" event');
            assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted address id');
            return tokenInstance.getCoffeeBatchActions(0);
        }).then(function(actions){
            assert.equal(byteToString(actions[0]), "creation", 'Action is creation');
            assert.equal(byteToString(actions[1]), "depulped", 'Action is depulped');
            return tokenInstance.getCoffeeBatchAction(0,"depulped");
        }).then(function(action){
            assert.equal(action[0], accounts[0], 'address is equal to inserted');
            assert.equal(byteToString(action[1]), "depulped", 'type of action is equal to inserted');
            assert.equal(action[2], '{"size":"0.5","symbol":"QQ}', 'additional information is equal to inserted');
            assert.equal(action[3], timeNow, 'time is equal to inserted');
        }); 
    });

    it('It handles Coffee Batch Tasting',function(){
        return Coffee.deployed().then(function(instance){
            tokenInstance = instance;
            timeNow = + new Date();
            return tokenInstance.addCoffeeBatchTasting(0,'Floral Dulce','Naranja','Cítrica suave','Cremoso','Floral y entonante','90.0','{"notes":"Bebida agradable al paladar"}',timeNow,{from:accounts[1]});
        }).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'LogAddCoffeeBatchTasting', 'should be the "LogAddCoffeeBatchTasting" event');
            assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted address id');
            return tokenInstance.getCoffeeBatchTasters(0);
        }).then(function(tasters){
            assert.equal(tasters[0], accounts[1],'taster needs to be the same');
            return tokenInstance.getCoffeeBatchCupProfile(0,tasters[0]);
        }).then(function(cupProfile){
            assert.equal(byteToString(cupProfile[0]),'Floral Dulce','aroma is equal to inserted');
            assert.equal(byteToString(cupProfile[1]),'Naranja','flavor is equal to inserted');
            assert.equal(byteToString(cupProfile[2]),'Cítrica suave','acidity is equal to inserted');
            assert.equal(byteToString(cupProfile[3]),'Cremoso','body is equal to inserted');
            assert.equal(byteToString(cupProfile[4]),'Floral y entonante','after taste is equal to inserted');
            assert.equal(cupProfile[5],'90.0','cupping note is equal to inserted');
            assert.equal(cupProfile[6],'{"notes":"Bebida agradable al paladar"}','additional Data is equal to inserted');
            assert.equal(cupProfile[7], timeNow, 'time is equal to inserted');
            timeNow = + new Date();
            return tokenInstance.addCoffeeBatchTasting(0,'Floral Dulce','Naranja y mandarina','Cítrica suave','Cremoso','Floral y persistente','92.0','{"notes":"Muy buena"}',timeNow,{from:accounts[2]});
        }).then(function(receipt){
            return tokenInstance.getTastersCount(0);
        }).then(function(count){
            assert.equal(count,2, 'Tasters size increase');
        }); 
    });

});