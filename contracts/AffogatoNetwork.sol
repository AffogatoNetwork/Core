pragma solidity ^0.4.23;

contract AffogatoNetwork {
  //Initialice the contract

  address admin;

  //Actors, Owners
  struct Producer{
    uint256 id;
    string producerName;
    string history;
    uint256[] farms; //IDs of ownerd farms
  }

  struct Processor{
    uint256 id;
    string name;
    string typeOfProcessor; //Beneficio, Cooperativa, Finca
    string village;
    string municipality;
    string department;
    string country;
  }

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

  //Coffee Process
  struct Cut{
    uint256 finalBatchSize; 
    bool isProcessComplete;
  }

  struct Depulped{
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    string processorId;
    bool isProcessComplete;
  }

  struct Fermented{
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    string processorId;
    string typeOfFermented;
    bool isProcessComplete;
  }

  struct Washed{
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    string processorId;
    bool isProcessComplete;
  }

  struct Drying{
    uint256 finalBatchSize;
    string typeOfDrying;
    bool isProcessedByFarm;
    string processorId;
    bool isProcessComplete;
  }

  struct Trite{
    uint256 finalBatchSize;
    bool isProcessedByFarm;
    string processorId;
    bool isProcessComplete;
  }

  struct CupProfile{
    string frangance;
    string flavor;
    string acidity;
    string body;
    string sweetness;
    string cuppingNote;
    string defects;
    string grainSize;
  }

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

  //Constructor, initialices the values
  constructor() public{
    admin = msg.sender;
  }

  //Inserts Producer and emits AddProducer event
  function addProducer(string _producerName, string _history) public {
    require(!isEmpty(_producerName) && !isEmpty(_history));
    uint currentId = producers.length;
    Producer memory producer = Producer(currentId, _producerName,_history, new uint[](0)); 
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
    Processor memory processor = Processor(currentId, _name, _typeOfProcessor, _village, _municipality, _department, _country); 
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
    Depulped memory depulped = Depulped(0,false,"",false);
    Fermented memory fermented = Fermented(0,false,"","",false);
    Washed memory washed = Washed(0,false,"",false);
    Drying memory drying = Drying(0,"",false,"",false);
    Trite memory trite = Trite(0,false,"",false);
    CupProfile memory cupProfile = CupProfile("","","","","","","","");
    CoffeeBatch memory coffeeBatch = CoffeeBatch(currentId, _farmId, _altitude, _process, _variety, cut, depulped, fermented, washed, drying,trite,cupProfile);
    coffeeBatches.push(coffeeBatch);
    farms[_farmId].coffeeBatches.push(currentId);
    emit AddCoffeeBatch(currentId);
  }

  function getCoffeeBatchId(uint _index) public constant returns(uint256) {
      return coffeeBatches[_index].id;
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
}