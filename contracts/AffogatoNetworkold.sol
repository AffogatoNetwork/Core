pragma solidity ^0.4.23;
import "./CupProfiling.sol";

contract AffogatoNetwork{
/*
  //Producers are the owner of the farms
  struct Producer{
    uint256 id;
    address owner;
    string producerName;
    string history;
    uint256[] farms; //IDs of ownerd farms
  }
  //Processors are actors who do process for farmers with no resources
  struct Processor{
    uint256 id;
    address owner;
    string name;
    string typeOfProcessor; //Beneficio, Cooperativa, Finca
    string village;
    string municipality;
    string department;
    string country;
  }

  //Farm where coffee batches are produced
  struct Farm{
    uint256 id;
    uint256 producerId;
    string farmName;
    string village;
    string municipality;
    string department;
    string country;
    uint256[] coffeeBatches; //IDs of Coffee Batches
  }

  //Start of Coffee Process
  //The size of the batch gets reduced in each step
  //First you cut the cherry in the farm
  struct Cut{
    uint256 finalBatchSize; 
    bool isProcessComplete;
    //TODO: Sell price - Cereza
  }

  //Then you depulp it
  struct Depulped{
    uint256 processorId;
    uint256 finalBatchSize;
    bool isProcessedByFarm; 
    bool isProcessComplete;
    address owner;
  }

  //Then you Ferment it
  struct Fermented{
    uint256 processorId;
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    string typeOfFermented;
    bool isProcessComplete;
    address owner;
  }

  //Then you wash it
  struct Washed{
    uint256 processorId;
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    bool isProcessComplete;
    address owner;
    //Sell Price - Humedo
  }

  //Then you dry it
  struct Drying{
    uint256 processorId;
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    string typeOfDrying;
    bool isProcessComplete;
    address owner;
    //TODO: Sell Price - Pergamino Seco
  }

  //Then you trite it
  struct Trite{
    uint256 processorId;
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    bool isProcessComplete;
    address owner;
    //TODO: Sell Price - Oro
  }

  //Then you export it or roast it

  // End of Coffee Process

  struct CoffeeBatch {
    uint256 id;
    uint256 farmId;
    uint256 altitude;
    string process;
    string variety;
    Cut cut;
    Depulped depulped;
    Fermented fermented;
    Washed washed;
    Drying drying;
    Trite trite;
    CupProfile cupProfile;
  }

  Producer[] public producers;
  Farm[] public farms;
  Processor[] public processors;
  CoffeeBatch[] public coffeeBatches;
 

  //Event Definition
  event AddProducer(uint256 indexed _id);
  event AddFarm(uint256 indexed _id);
  event AddCoffeeBatch(uint256 indexed _id);
  event AddProcessor(uint256 indexed _id);
  event UpdateCoffeeBatchCut(uint256 indexed _batchId);
  event UpdateCoffeeBatchDepulped(uint256 indexed _batchId);
  event UpdateCoffeeBatchFermented(uint256 indexed _batchId);
  event UpdateCoffeeBatchWashed(uint256 indexed _batchId);
  event UpdateCoffeeBatchDrying(uint256 indexed _batchId);
  event UpdateCoffeeBatchTrite(uint256 indexed _batchId);
  event UpdateCupProfile(uint256 indexed _batchId);

  //Constructor, initialices the values
  constructor() public{
    admin = msg.sender;
  }

  //Inserts Producer and emits AddProducer event
  function addProducer(string _producerName, string _history) public {
    require(!isEmpty(_producerName) && !isEmpty(_history));
    uint currentId = producers.length;
    Producer memory producer = Producer(currentId,msg.sender, _producerName,_history, new uint[](0)); 
    producers.push(producer);  
    emit AddProducer(currentId);
  }

  //Inserts Farm and emits AddFarm event
  function addProcessor(
    string _name,
    string _typeOfProcessor,
    string _village,
    string _municipality,
    string _department,
    string _country
  ) public {
    require(!isEmpty(_typeOfProcessor) && !isEmpty(_name) && !isEmpty(_village) && !isEmpty(_municipality) && !isEmpty(_department) && !isEmpty(_country));
    uint currentId = processors.length;
    Processor memory processor = Processor(currentId, msg.sender, _name, _typeOfProcessor, _village, _municipality, _department, _country); 
    processors.push(processor);  
    emit AddProcessor(currentId);
  }

  //Inserts Batch of coffee, updates farm batches and emits AddCoffeeBatch event
  function addCoffeeBatch(
    uint256 _farmId,
    uint256 _altitude,
    string _process,
    string _variety
  ) public {

    require(farms.length >= _farmId);
    require(!isEmpty(_process) && !isEmpty(_variety));

    uint currentId = coffeeBatches.length;
    
    //initialices empty structs
    Cut memory cut = Cut(0,false);
    Depulped memory depulped = Depulped(0,0,false,false,0x0);
    Fermented memory fermented = Fermented(0,0,false,"",false,0x0);
    Washed memory washed = Washed(0,0,false,false,0x0);
    Drying memory drying = Drying(0,0,false,"",false,0x0);
    Trite memory trite = Trite(0,0,false,false,0x0);
    CupProfile memory cupProfile = CupProfile("","","","","", new string[](0),"","", new address[](0));
    CoffeeBatch memory coffeeBatch = CoffeeBatch(currentId, _farmId, _altitude, _process, _variety, cut, depulped, fermented, washed, drying,trite,cupProfile);
    coffeeBatches.push(coffeeBatch);
    farms[_farmId].coffeeBatches.push(currentId);
    emit AddCoffeeBatch(currentId);
  }

  function getCoffeeBatchInfo(uint _index) public constant 
  returns(uint256,uint256,uint256,string,string) {
    CoffeeBatch memory coffeeBatch = coffeeBatches[_index];
    return(coffeeBatch.id,
      coffeeBatch.farmId, 
      coffeeBatch.altitude, 
      coffeeBatch.process, 
      coffeeBatch.variety
    );
  }

  function getCoffeeBatchCut(uint _index) public constant 
  returns(uint256,bool) {
    Cut memory cut = coffeeBatches[_index].cut;
    return(cut.finalBatchSize, 
        cut.isProcessComplete
    );
  }

  function updateCoffeeBatchCut(uint _index, uint256 _finalBatchSize, bool _isProcessComplete) public { 
    require(coffeeBatches.length >= _index);

    Cut storage cut = coffeeBatches[_index].cut;
    cut.finalBatchSize = _finalBatchSize;
    cut.isProcessComplete = _isProcessComplete;
    emit UpdateCoffeeBatchCut(_index);
  }

  function getCoffeeBatchDepulped(uint _index) public constant 
  returns(uint256,uint256,bool,bool) {
    Depulped memory depulped = coffeeBatches[_index].depulped;
    return( depulped.processorId, 
              depulped.finalBatchSize, 
              depulped.isProcessedByFarm, 
              depulped.isProcessComplete
    );
  }

  function updateCoffeeBatchDepulped(uint _index, uint _processorId, uint256 _finalBatchSize, bool _isProcessedByFarm, bool _isProcessComplete) public { 
    require(coffeeBatches.length >= _index);
    require(processors.length >= _processorId);

    Depulped storage depulped = coffeeBatches[_index].depulped;
    depulped.processorId = _processorId;
    depulped.finalBatchSize = _finalBatchSize;
    depulped.isProcessedByFarm = _isProcessedByFarm;
    depulped.isProcessComplete = _isProcessComplete;

    emit UpdateCoffeeBatchDepulped(_index);
  }

  function getCoffeeBatchFermented(uint _index) public constant 
  returns(uint256,uint256,bool,string,bool) {
    Fermented memory fermented = coffeeBatches[_index].fermented;
    return( fermented.processorId, 
              fermented.finalBatchSize, 
              fermented.isProcessedByFarm, 
              fermented.typeOfFermented,
              fermented.isProcessComplete
    );
  }

  function updateCoffeeBatchFermented(uint _index, uint _processorId, uint256 _finalBatchSize, bool _isProcessedByFarm, string _typeOfFermented, bool _isProcessComplete) public { 
    require(coffeeBatches.length >= _index);
    require(processors.length >= _processorId);

    Fermented storage fermented = coffeeBatches[_index].fermented;
    fermented.processorId = _processorId;
    fermented.finalBatchSize = _finalBatchSize;
    fermented.isProcessedByFarm = _isProcessedByFarm;
    fermented.typeOfFermented = _typeOfFermented;
    fermented.isProcessComplete = _isProcessComplete;

    emit UpdateCoffeeBatchFermented(_index);
  }

  function getCoffeeBatchWashed(uint _index) public constant 
  returns(uint256,uint256,bool,bool) {
    Washed memory washed = coffeeBatches[_index].washed;
    return( washed.processorId, 
              washed.finalBatchSize, 
              washed.isProcessedByFarm, 
              washed.isProcessComplete
    );
  }

  function updateCoffeeBatchWashed(uint _index, uint _processorId, uint256 _finalBatchSize, bool _isProcessedByFarm, bool _isProcessComplete) public { 
    require(coffeeBatches.length >= _index);
    require(processors.length >= _processorId);

    Washed storage washed = coffeeBatches[_index].washed;
    washed.processorId = _processorId;
    washed.finalBatchSize = _finalBatchSize;
    washed.isProcessedByFarm = _isProcessedByFarm;
    washed.isProcessComplete = _isProcessComplete;

    emit UpdateCoffeeBatchWashed(_index);
  }

  function getCoffeeBatchDrying(uint _index) public constant 
  returns(uint256,uint256,bool,string,bool) {
    Drying memory drying = coffeeBatches[_index].drying;
    return( drying.processorId, 
              drying.finalBatchSize, 
              drying.isProcessedByFarm, 
              drying.typeOfDrying,
              drying.isProcessComplete
    );
  }

  function updateCoffeeBatchDrying(uint _index, uint _processorId, uint256 _finalBatchSize, bool _isProcessedByFarm, string _typeOfDrying, bool _isProcessComplete) public { 
    require(coffeeBatches.length >= _index);
    require(processors.length >= _processorId);

    Drying storage drying = coffeeBatches[_index].drying;
    drying.processorId = _processorId;
    drying.finalBatchSize = _finalBatchSize;
    drying.typeOfDrying = _typeOfDrying;
    drying.isProcessedByFarm = _isProcessedByFarm;
    drying.isProcessComplete = _isProcessComplete;

    emit UpdateCoffeeBatchDrying(_index);
  }

  function getCoffeeBatchTrite(uint _index) public constant 
  returns(uint256,uint256,bool,bool) {
    Trite memory trite = coffeeBatches[_index].trite;
    return( trite.processorId, 
              trite.finalBatchSize, 
              trite.isProcessedByFarm, 
              trite.isProcessComplete
    );
  }

  function updateCoffeeBatchTrite(uint _index, uint _processorId, uint256 _finalBatchSize, bool _isProcessedByFarm, bool _isProcessComplete) public { 
    require(coffeeBatches.length >= _index);
    require(processors.length >= _processorId);

    Trite storage trite = coffeeBatches[_index].trite;
    trite.processorId = _processorId;
    trite.finalBatchSize = _finalBatchSize;
    trite.isProcessedByFarm = _isProcessedByFarm;
    trite.isProcessComplete = _isProcessComplete;

    emit UpdateCoffeeBatchTrite(_index);
  }

 

  function updateCupProfile(
    uint _index,
    string _frangance, 
    string _flavor, 
    string _acidity, 
    string _body, 
    string _defects, 
    string _grainSize
  ) public { 
    require(coffeeBatches.length >= _index);

    CupProfile storage cupProfile = coffeeBatches[_index].cupProfile;
    cupProfile.frangance = _frangance;
    cupProfile.flavor = _flavor;
    cupProfile.acidity = _acidity;
    cupProfile.body = _body;
    cupProfile.defects = _defects;
    cupProfile.grainSize = _grainSize;

    emit UpdateCupProfile(_index);
  }

  //Inserts Farm and emits AddFarm event
  function addFarm(
    uint _producerId,
    string _farmName,
    string _village,
    string _municipality,
    string _department,
    string _country
  ) public {
    require(producers.length >= _producerId);
    require(!isEmpty(_farmName) && !isEmpty(_village) && !isEmpty(_municipality) && !isEmpty(_country));

    uint currentId = farms.length;
    Farm memory farm = Farm(currentId, _producerId, _farmName, _village, _municipality, _department, _country, new uint[](0)); 
    farms.push(farm);  
    producers[_producerId].farms.push(currentId);

    emit AddFarm(currentId);
  }

  //Gets Producer Farms 
  function getProducerFarms(uint256 _index) public view returns (uint256[]) {
    return producers[_index].farms;
  }

  //Gets farm batches
  function getFarmBatches(uint256 _index) public view returns (uint256[]) {
    return farms[_index].coffeeBatches;
  }


  function isEmpty(string _empty) internal pure returns (bool){
    bytes memory tempEmptyString = bytes(_empty); // Uses memory
    if (tempEmptyString.length == 0) {
      return true;
    } else {
      return false;
    }
  }
  */
}