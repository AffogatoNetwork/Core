pragma solidity ^0.4.23;

contract AffogatoNetwork {
  //Initialice the contract

  address admin;
  uint256 public count;

  struct CoffeeBatch {
    uint256 id;
    uint256 auditCode;
    string cuppingFinalNote;
    string producerName;
    string farmName;
    string village;
    string municipality;
    string department;
    string country;
    string batchSize;
    uint256 altitude;
    string process;
    string variety;
  }

  //removed public because struct is to big, "Stack too deep, try using less variables.""
  mapping(uint256 => CoffeeBatch) coffeeBatches;

  //Event Definition
  event AddCoffeeBatch(uint256 indexed _id);

  //Constructor, initialices the values
  constructor() public{
    admin = msg.sender;
    count = 0;
  }

  //Inserts Batch of coffee in Mapping and emits AddCoffeeBatch event
  function addCoffeeBatch(
    uint256 _auditCode,
    string _cuppingFinalNote,
    string _producerName,
    string _farmName,
    string _village,
    string _municipality,
    string _department,
    string _country,
    string _batchSize,
    uint256 _altitude,
    string _process,
    string _variety
  ) public{  
    uint256 id = count;
    coffeeBatches[id] = CoffeeBatch(id, _auditCode, _cuppingFinalNote, _producerName, _farmName, _village, _municipality, _department, _country, _batchSize, _altitude, _process, _variety);
    count++;
    emit AddCoffeeBatch(id);
  }

 //Mapping of objects 


 //Save objects on blockchain
 //get objects by id
 //only people witch access can write
 //set admin 
 //set permissions
 //create events
 //update count

}
