var AffogatoNetwork = artifacts.require("./AffogatoNetwork.sol");

contract(AffogatoNetwork,function(accounts){
	var tokenInstance;
	
	/*it('Initializes the contract with the correct values',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.count();
		}).then(function(count){
			assert.equal(count,0,"Count is initialized with 0");
		});
	});*/

	it('Inserts and returns a Producer',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.addProducer("","");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addProducer("Enrique Ferrufino","In Matagalpa, Nicaragua, Don Enrique Ferrufino and his son, Enrique, work tirelessly to run a family farming operation that produces high quality coffee year after year.");
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'AddProducer', 'should be the "AddProducer" event');
      		assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted producer id');
      		return tokenInstance.producers(0);
		}).then(function(producer){
      		assert.equal(producer[0].toNumber(),0,"Id is equal to inserted");
			assert.equal(producer[1],"Enrique Ferrufino","producerName is equal to inserted");
			assert.equal(producer[2],"In Matagalpa, Nicaragua, Don Enrique Ferrufino and his son, Enrique, work tirelessly to run a family farming operation that produces high quality coffee year after year.","history is equal to inserted")
			return tokenInstance.getProducerFarms.call(0);      		
		}).then(function(farms){
			assert.equal(farms.length, 0,"Farms are empty"); 
			return tokenInstance.addProducer("Remiery Orlando Carvajal Guevara","In Matagalpa, Nicaragua, Don Enrique Ferrufino and his son, Enrique, work tirelessly to run a family farming operation that produces high quality coffee year after year.");
		}).then(function(receipt){
			assert.equal(receipt.logs[0].args._id.toNumber(), 1, 'logs the inserted incremented id');
		});
	});

	it('Inserts and returns a Processor',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.addProcessor("", "", "", "", "", "");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addProcessor("Beneficio Caballero","Beneficio", "San Francisco", "Marcala", "La Paz", "Honduras");
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'AddProcessor', 'should be the "AddProcessor" event');
      		assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted farm id');
      		return tokenInstance.processors(0);
		}).then(function(processor){
      		assert.equal(processor[0].toNumber(),0,"Id is equal to inserted");
			assert.equal(processor[1],"Beneficio Caballero","name is equal to inserted");
			assert.equal(processor[2],"Beneficio","typeOfProcessor is equal to inserted");
			assert.equal(processor[3],"San Francisco","village is equal to inserted");
			assert.equal(processor[4],"Marcala","municipality is equal to inserted");
			assert.equal(processor[5],"La Paz","department is equal to inserted");
			assert.equal(processor[6],"Honduras","country is equal to inserted");
			return tokenInstance.addProcessor("Cooperativa Pedro","Cooperativa", "Nueva Guinea", "Marcala", "La Paz", "Honduras");	
		}).then(function(receipt){
			assert.equal(receipt.logs[0].args._id.toNumber(), 1, 'logs the inserted incremented id');
		});
	});
/*
	it('Inserts and returns a Farm',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.addFarm("", "", "", "", "", "");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addFarm("Fabio Antonio Caballero Martinez", "San Francisco", "San Francisco", "Marcala", "La Paz", "Honduras");
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'AddFarm', 'should be the "AddFarm" event');
      		assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted farm id');
      		return tokenInstance.farms(0);
		}).then(function(farm){
      		assert.equal(farm[0].toNumber(),0,"Id is equal to inserted");
			assert.equal(farm[1],"Fabio Antonio Caballero Martinez","producerName is equal to inserted");
			assert.equal(farm[2],"San Francisco","farmName is equal to inserted");
			assert.equal(farm[3],"San Francisco","village is equal to inserted");
			assert.equal(farm[4],"Marcala","municipality is equal to inserted");
			assert.equal(farm[5],"La Paz","department is equal to inserted");
			assert.equal(farm[6],"Honduras","country is equal to inserted");
			return tokenInstance.getFarmBatches.call(0);      		
		}).then(function(farmBatches){
			assert.equal(farmBatches.length, 0,"Batches are empty"); 
			return tokenInstance.addFarm("Remiery Orlando Carvajal Guevara", "Los Pinos", "Esquinpara", "San Andres", "Lempira", "Honduras");
		}).then(function(receipt){
			assert.equal(receipt.logs[0].args._id.toNumber(), 1, 'logs the inserted incremented id');
		});
	});*/

/*	it('Inserts and return Coffee Batch',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.addCoffeeBatch(571, "93.43", "11.7", 1350, "Lavado", "Geisha Emperador",99999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addCoffeeBatch(0, "", "", 0, "", "",0);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addCoffeeBatch(571, "93.43", "11.7", 1350, "Lavado", "Geisha Emperador",0);
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'AddCoffeeBatch', 'should be the "AddCoffeeBatch" event');
      		assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted batch id');
      		return tokenInstance.coffeeBatches(0);
		}).then(function(coffeeBatch){
      		assert.equal(coffeeBatch[0].toNumber(),0,"Id is equal to inserted");
			assert.equal(coffeeBatch[1].toNumber(),571,"auditCode is equal to inserted");
			assert.equal(coffeeBatch[2],"93.43","cuppingFinalNote is equal to inserted");
			assert.equal(coffeeBatch[3],"11.7","batchSize is equal to inserted");
			assert.equal(coffeeBatch[4].toNumber(),1350,"altitude is equal to inserted");
			assert.equal(coffeeBatch[5],"Lavado","process is equal to inserted");
			assert.equal(coffeeBatch[6],"Geisha Emperador","variety is equal to inserted");
			assert.equal(coffeeBatch[7].toNumber(),0,"farm ID is equal to inserted");
      		return tokenInstance.addCoffeeBatch(261, "92.64", "14.37", 1600, "Lavado", "Typica",0);
		}).then(function(receipt){
			assert.equal(receipt.logs[0].args._id.toNumber(), 1, 'logs the inserted incremented id');
			return tokenInstance.getFarmBatches.call(0);
		}).then(function(farmBatches){
			assert.equal(farmBatches[0].toNumber(), 0,"First value should be 0");
			assert.equal(farmBatches[1], 1,"Second value should be 1");
			assert.equal(farmBatches.length, 2,"There should be 2 batches");
		});
	});*/

	
});