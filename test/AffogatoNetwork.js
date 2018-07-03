/*var AffogatoNetwork = artifacts.require("./AffogatoNetwork.sol");

contract(AffogatoNetwork,function(accounts){
	var tokenInstance;
	
	/*it('Initializes the contract with the correct values',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.count();
		}).then(function(count){
			assert.equal(count,0,"Count is initialized with 0");
		});
	});

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

	it('Inserts and returns a Farm',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.addFarm(0, "", "", "", "", "");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addFarm(9999999999999999999, "San Francisco", "San Francisco", "Marcala", "La Paz", "Honduras");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addFarm(0, "San Francisco", "San Francisco", "Marcala", "La Paz", "Honduras");
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'AddFarm', 'should be the "AddFarm" event');
      		assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted farm id');
      		return tokenInstance.farms(0);
		}).then(function(farm){
      		assert.equal(farm[0].toNumber(),0,"Id is equal to inserted");
			assert.equal(farm[1],0,"producerId is equal to inserted");
			assert.equal(farm[2],"San Francisco","farmName is equal to inserted");
			assert.equal(farm[3],"San Francisco","village is equal to inserted");
			assert.equal(farm[4],"Marcala","municipality is equal to inserted");
			assert.equal(farm[5],"La Paz","department is equal to inserted");
			assert.equal(farm[6],"Honduras","country is equal to inserted");
			return tokenInstance.getFarmBatches.call(0);      		
		}).then(function(farmBatches){
			assert.equal(farmBatches.length, 0,"Batches are empty"); 
			return tokenInstance.addFarm(0, "Los Pinos", "Esquinpara", "San Andres", "Lempira", "Honduras");
		}).then(function(receipt){
			assert.equal(receipt.logs[0].args._id.toNumber(), 1, 'logs the inserted incremented id');
			return tokenInstance.getProducerFarms.call(0);
		}).then(function(producerFarms){
			assert.equal(producerFarms[0].toNumber(), 0,"First value should be 0");
			assert.equal(producerFarms[1], 1,"Second value should be 1");
			assert.equal(producerFarms.length, 2,"There should be 2 batches");
		});
	});

	it('Inserts and return Coffee Batch',function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.addCoffeeBatch(99999999, 1350, "Lavado", "Geisha Emperador");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addCoffeeBatch(0, 0, "", "");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.addCoffeeBatch(0, 1350, "Lavado", "Geisha Emperador");
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'AddCoffeeBatch', 'should be the "AddCoffeeBatch" event');
      		assert.equal(receipt.logs[0].args._id.toNumber(), 0, 'logs the inserted batch id');
      		//WARNING: return struct with structs not supported, needed to create a new function that only returns the strings
      		return tokenInstance.getCoffeeBatchInfo(0);
		}).then(function(coffeeBatchInfo){
      		assert.equal(coffeeBatchInfo[0].toNumber(),0,"Id is equal to inserted");
			assert.equal(coffeeBatchInfo[1].toNumber(),0,"farmId is equal to inserted");
			assert.equal(coffeeBatchInfo[2].toNumber(),1350,"altitude is equal to inserted");
			assert.equal(coffeeBatchInfo[3],"Lavado","process is equal to inserted");
			assert.equal(coffeeBatchInfo[4],"Geisha Emperador","variety is equal to inserted");
			return tokenInstance.getCoffeeBatchCut(0);
		}).then(function(coffeeBatchCut){
			assert.equal(coffeeBatchCut[0].toNumber(),0,"batch size is equal to initial value");
			assert.equal(coffeeBatchCut[1],false,"isProcessComplete is equal to initial value");
			return tokenInstance.getCoffeeBatchDepulped(0);
		}).then(function(coffeeBatchDepulped){
			assert.equal(coffeeBatchDepulped[0].toNumber(),0,"processorId is equal to initial value");
			assert.equal(coffeeBatchDepulped[1].toNumber(),0,"batch size is equal to initial value");
			assert.equal(coffeeBatchDepulped[2],false,"isProcessedByFarm is equal to initial value");
			assert.equal(coffeeBatchDepulped[3],false,"isProcessComplete is equal to initial value");
			return tokenInstance.getCoffeeBatchFermented(0);
		}).then(function(coffeeBatchFermented){
			assert.equal(coffeeBatchFermented[0].toNumber(),0,"processorId is equal to initial value");
			assert.equal(coffeeBatchFermented[1].toNumber(),0,"batch size is equal to initial value");
			assert.equal(coffeeBatchFermented[2],false,"isProcessedByFarm is equal to initial value");
			assert.equal(coffeeBatchFermented[3],"","type of fermented is equal to initial value");
			assert.equal(coffeeBatchFermented[4],false,"isProcessComplete is equal to initial value");
			return tokenInstance.getCoffeeBatchWashed(0);
		}).then(function(coffeeBatchWashed){
			assert.equal(coffeeBatchWashed[0].toNumber(),0,"processorId is equal to initial value");
			assert.equal(coffeeBatchWashed[1].toNumber(),0,"batch size is equal to initial value");
			assert.equal(coffeeBatchWashed[2],false,"isProcessedByFarm is equal to initial value");
			assert.equal(coffeeBatchWashed[3],false,"isProcessComplete is equal to initial value");
			return tokenInstance.getCoffeeBatchDrying(0);
		}).then(function(coffeeBatchDrying){
			assert.equal(coffeeBatchDrying[0].toNumber(),0,"processorId is equal to initial value");
			assert.equal(coffeeBatchDrying[1].toNumber(),0,"batch size is equal to initial value");
			assert.equal(coffeeBatchDrying[2],false,"isProcessedByFarm is equal to initial value");
			assert.equal(coffeeBatchDrying[3],"","type of drying is equal to initial value");
			assert.equal(coffeeBatchDrying[4],false,"isProcessComplete is equal to initial value");
			return tokenInstance.getCoffeeBatchTrite(0);
		}).then(function(coffeeBatchTrite){
			assert.equal(coffeeBatchTrite[0].toNumber(),0,"processorId is equal to initial value");
			assert.equal(coffeeBatchTrite[1].toNumber(),0,"batch size is equal to initial value");
			assert.equal(coffeeBatchTrite[2],false,"isProcessedByFarm is equal to initial value");
			assert.equal(coffeeBatchTrite[3],false,"isProcessComplete is equal to initial value");
			return tokenInstance.getCupProfile(0);
		}).then(function(cupProfile){
			assert.equal(cupProfile[0],"","initial value is equal to empty");
			assert.equal(cupProfile[1],"","initial value is equal to empty");
			assert.equal(cupProfile[2],"","initial value is equal to empty");
			assert.equal(cupProfile[3],"","initial value is equal to empty");
			assert.equal(cupProfile[4],"","initial value is equal to empty");
			assert.equal(cupProfile[5],"","initial value is equal to empty");
			assert.equal(cupProfile[6],"","initial value is equal to empty");
			return tokenInstance.addCoffeeBatch(0, 1600, "Lavado", "Typica");
		}).then(function(receipt){
			assert.equal(receipt.logs[0].args._id.toNumber(), 1, 'logs the inserted incremented id');
			return tokenInstance.getFarmBatches.call(0);
		}).then(function(farmBatches){
			assert.equal(farmBatches[0].toNumber(), 0,"First value should be 0");
			assert.equal(farmBatches[1], 1,"Second value should be 1");
			assert.equal(farmBatches.length, 2,"There should be 2 batches");
		});
	});

	it("updates the coffee cut process", function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.updateCoffeeBatchCut.call(99999999999,1000, true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchCut(0,1000, true);
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'UpdateCoffeeBatchCut', 'should be the "UpdateCoffeeBatchCut" event');
      		assert.equal(receipt.logs[0].args._batchId.toNumber(), 0, 'logs the inserted batch id');
      		assert.equal(receipt.logs[0].args._finalBatchSize.toNumber(), 1000, 'logs the final batch size');
      		assert.equal(receipt.logs[0].args._isProcessComplete, true, 'logs the process complete');
		});
	});	

	it("updates the coffee depulped process", function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.updateCoffeeBatchDepulped(99999999999,1,1000, true, true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchDepulped(0,9999999999,1000, true, true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchDepulped(0,1,1000, false, true);
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'UpdateCoffeeBatchDepulped', 'should be the "updateCoffeeBatchDepulped" event');
      		assert.equal(receipt.logs[0].args._batchId.toNumber(), 0, 'logs the inserted batch id');
      		assert.equal(receipt.logs[0].args._processorId.toNumber(), 1, 'logs the processor id');
      		assert.equal(receipt.logs[0].args._finalBatchSize.toNumber(), 1000, 'logs the final batch size');
      		assert.equal(receipt.logs[0].args._isProcessedByFarm, false, 'logs the process complete');
      		assert.equal(receipt.logs[0].args._isProcessComplete, true, 'logs the process complete');
		});
	});

	it("updates the coffee fermented process", function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.updateCoffeeBatchFermented.call(99999999999,1,1000, true, "Natural", true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchFermented.call(0,9999999999,1000, true, "Natural", true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchFermented(0,1,1000, false, "Natural", true);
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'UpdateCoffeeBatchFermented', 'should be the "UpdateCoffeeBatchFermented" event');
      		assert.equal(receipt.logs[0].args._batchId.toNumber(), 0, 'logs the inserted batch id');
      		assert.equal(receipt.logs[0].args._processorId.toNumber(), 1, 'logs the processor id');
      		assert.equal(receipt.logs[0].args._finalBatchSize.toNumber(), 1000, 'logs the final batch size');
      		assert.equal(receipt.logs[0].args._isProcessedByFarm, false, 'logs the process complete');
      		assert.equal(receipt.logs[0].args._typeOfFermented, "Natural", 'logs the type of fermented');
      		assert.equal(receipt.logs[0].args._isProcessComplete, true, 'logs the process complete');
		});
	});

	it("updates the coffee washed process", function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.updateCoffeeBatchWashed.call(99999999999,1,1000, true, true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchWashed.call(0,9999999999,1000, true, true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchWashed(0,1,1000, false, true);
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'UpdateCoffeeBatchWashed', 'should be the "UpdateCoffeeBatchWashed" event');
      		assert.equal(receipt.logs[0].args._batchId.toNumber(), 0, 'logs the inserted batch id');
      		assert.equal(receipt.logs[0].args._processorId.toNumber(), 1, 'logs the processor id');
      		assert.equal(receipt.logs[0].args._finalBatchSize.toNumber(), 1000, 'logs the final batch size');
      		assert.equal(receipt.logs[0].args._isProcessedByFarm, false, 'logs the process complete');
      		assert.equal(receipt.logs[0].args._isProcessComplete, true, 'logs the process complete');
		});
	});

	it("updates the coffee drying process", function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.updateCoffeeBatchDrying.call(99999999999,1,1000, true, "Machine", true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchDrying.call(0,9999999999,1000, true, "Machine", true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchDrying(0,1,1000, false, "Machine", true);
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'UpdateCoffeeBatchDrying', 'should be the "UpdateCoffeeBatchDrying" event');
      		assert.equal(receipt.logs[0].args._batchId.toNumber(), 0, 'logs the inserted batch id');
      		assert.equal(receipt.logs[0].args._processorId.toNumber(), 1, 'logs the processor id');
      		assert.equal(receipt.logs[0].args._finalBatchSize.toNumber(), 1000, 'logs the final batch size');
      		assert.equal(receipt.logs[0].args._isProcessedByFarm, false, 'logs the process complete');
      		assert.equal(receipt.logs[0].args._typeOfDrying, "Machine", 'logs the type of drying');
      		assert.equal(receipt.logs[0].args._isProcessComplete, true, 'logs the process complete');
		});
	});

	it("updates the coffee trited process", function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.updateCoffeeBatchTrite.call(99999999999,1,1000, true, true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchTrite.call(0,9999999999,1000, true, true);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCoffeeBatchTrite(0,1,1000, false, true);
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'UpdateCoffeeBatchTrite', 'should be the "UpdateCoffeeBatchTrite" event');
      		assert.equal(receipt.logs[0].args._batchId.toNumber(), 0, 'logs the inserted batch id');
      		assert.equal(receipt.logs[0].args._processorId.toNumber(), 1, 'logs the processor id');
      		assert.equal(receipt.logs[0].args._finalBatchSize.toNumber(), 1000, 'logs the final batch size');
      		assert.equal(receipt.logs[0].args._isProcessedByFarm, false, 'logs the process complete');
      		assert.equal(receipt.logs[0].args._isProcessComplete, true, 'logs the process complete');
		});
	});


	it("updates the cup profile", function(){
		return AffogatoNetwork.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.updateCupProfile.call(999999999999,"","","","","","","");
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "Error message must contain revert");
			return tokenInstance.updateCupProfile(0,"Pasas","Ciruela roja, azucar morena, frutes secas","Malica a manzana verde","Balanceado","98","0","12");
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
      		assert.equal(receipt.logs[0].event, 'UpdateCupProfile', 'should be the "UpdateCupProfile" event');
      		assert.equal(receipt.logs[0].args._batchId.toNumber(), 0, 'logs the inserted batch id');
      		assert.equal(receipt.logs[0].args._frangance, "Pasas", 'logs the fragance complete');
      		assert.equal(receipt.logs[0].args._flavor, "Ciruela roja, azucar morena, frutes secas", 'logs the flavor complete');
      		assert.equal(receipt.logs[0].args._acidity, "Malica a manzana verde", 'logs the acidity complete');
      		assert.equal(receipt.logs[0].args._body, "Balanceado", 'logs the body complete');
      		assert.equal(receipt.logs[0].args._cuppingNote, "98", 'logs the cuppingNote complete');
      		assert.equal(receipt.logs[0].args._defects, "0", 'logs the defects complete');
      		assert.equal(receipt.logs[0].args._grainSize, "12", 'logs the grainSize complete');
		});
	});
});*/