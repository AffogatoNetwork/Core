pragma solidity ^0.4.23;

contract AffogatoNetwork {
  //Initialice the contract

  address admin;

  struct CoffeeBatch {
    uint256 id;
    uint256 auditCode;
    string cuppingFinalNote;
    string batchSize;
    uint256 altitude;
    string process;
    string variety;
    uint256 farmId;
  }

  struct Farm{
    uint256 id;
    string producerName;
    string farmName;
    string village;
    string municipality;
    string department;
    string country;
    uint256[] coffeeBatchesIds;
  }

  CoffeeBatch[] public coffeeBatches;
  Farm[] public farms;

  //Event Definition
  event AddCoffeeBatch(uint256 indexed _id);
  event AddFarm(uint256 indexed _id);

  //Constructor, initialices the values
  constructor() public{
    admin = msg.sender;
  }

  //Inserts Batch of coffee, updates farm batches and emits AddCoffeeBatch event
  function addCoffeeBatch(
    uint256 _auditCode,
    string _cuppingFinalNote,
    string _batchSize,
    uint256 _altitude,
    string _process,
    string _variety,
    uint256 _farmId
  ) public {    
   //TODO: Farm must exists
    coffeeBatches.push(CoffeeBatch(coffeeBatches.length, _auditCode, _cuppingFinalNote, _batchSize, _altitude, _process, _variety, _farmId));
    emit AddCoffeeBatch(coffeeBatches.length);
  }

  //Inserts Farm and emits AddFarm event
  function addFarm(
    string _producerName,
    string _farmName,
    string _village,
    string _municipality,
    string _department,
    string _country
  ) public {
    Farm memory farm = Farm(farms.length, _producerName, _farmName, _village, _municipality, _department, _country, new uint[](0)); 
    farms.push(farm);  
    emit AddFarm(farms.length);
  }

  //Gets farm batches
  function getFarmBatches(uint256 _index) public returns (uint256[]) {
      return farms[_index].coffeeBatchesIds;
  }

}
