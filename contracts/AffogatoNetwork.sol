pragma solidity ^0.4.23;

contract AffogatoNetwork {
  //Initialice the contract

  address admin;
  uint256 public count;

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

  struct farm{
    uint256 id;
    string producerName;
    string farmName;
    string village;
    string municipality;
    string department;
    string country;
  }

  //removed public because struct is to big, "Stack too deep, try using less variables.""
  CoffeeBatch[] public coffeeBatches;

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
    string _batchSize,
    uint256 _altitude,
    string _process,
    string _variety,
    uint256 _farmId
  ) public {  
   // coffeeBatches.length++;   
    coffeeBatches.push(CoffeeBatch(coffeeBatches.length, _auditCode, _cuppingFinalNote, _batchSize, _altitude, _process, _variety, _farmId));
    emit AddCoffeeBatch(coffeeBatches.length);
    //return (coffeeBatches.length);
  }

  //Inserts Batch of coffee in Mapping and emits AddCoffeeBatch event
  function addFarm(
    string _producerName,
    string _farmName,
    string _village,
    string _municipality,
    string _department,
    string _country
  ) public{  
   // uint256 id = count;
   // coffeeBatches[id] = CoffeeBatch(id, _auditCode, _cuppingFinalNote, _producerName, _farmName, _village, _municipality, _department, _country, _batchSize, _altitude, _process, _variety);
   // count++;
  //  emit AddCoffeeBatch(id);
  }
/*
  function getCoffeeBatch( uint256 _id) public returns
  (
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
  ){  
 //   return coffeeBatches[id];
//    emit AddCoffeeBatch(id);
  }
*/


 //get objects by id
 //only people witch access can write
 //set permissions
 //create events

 /*
  contract SalaryInfo {
    struct User {
        uint salaryId;
        string name;
        string userAddress;
        uint salary;
    }
    User[] public users;

    function addUser(uint _salaryId, string _name, string _userAddress, uint _salary) public returns(uint) {
        users.length++;
        users[users.length-1].salaryId = _salaryId;
        users[users.length-1].name = _name;
        users[users.length-1].userAddress = _userAddress;
        users[users.length-1].salary = _salary;
        return users.length;
    }

    function getUsersCount() public constant returns(uint) {
        return users.length;
    }

    function getUser(uint index) public constant returns(uint, string, string, uint) {
        return (users[index].salaryId, users[index].name, users[index].userAddress, users[index].salary);
    }
}
 */

}
