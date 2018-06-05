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
    require(farms.length >= _farmId);
    require(!isEmpty(_cuppingFinalNote) && !isEmpty(_batchSize) && !isEmpty(_process) && !isEmpty(_variety));
    uint currentId = coffeeBatches.length;
    coffeeBatches.push(CoffeeBatch(currentId, _auditCode, _cuppingFinalNote, _batchSize, _altitude, _process, _variety, _farmId));
    farms[_farmId].coffeeBatchesIds.push(currentId);
    emit AddCoffeeBatch(currentId);
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
    require(!isEmpty(_producerName) && !isEmpty(_farmName) && !isEmpty(_village) && !isEmpty(_municipality) && !isEmpty(_country));
    uint currentId = farms.length;
    Farm memory farm = Farm(currentId, _producerName, _farmName, _village, _municipality, _department, _country, new uint[](0)); 
    farms.push(farm);  
    emit AddFarm(currentId);
  }

  //Gets farm batches
  function getFarmBatches(uint256 _index) public view returns (uint256[]) {
      return farms[_index].coffeeBatchesIds;
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
