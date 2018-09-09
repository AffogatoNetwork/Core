pragma solidity ^0.4.23;

contract Coffee{

    event LogAddCoffeeBatch(
        uint indexed _id,
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bool _isSold
    );
    event LogUpdateCoffeeBatch(
        uint indexed _id,
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bool _isSold
    );
     
    struct CoffeeBatch{
        uint uid;
        uint farmUid;
        uint16 altitude;
        bytes32 variety;
        bytes32 process;
        //QQ - Precision two decimals 100.00
        uint32 size;
        bool isSold;  
    }

   mapping(uint => CoffeeBatch) public coffeeBatches;
   mapping(uint => uint[]) public farmToBatches;
   // mapping(uint256 => CoffeeBatch) coffeeBatches;
   // uint256[] coffeeBatchIds;
   uint coffeeBatchCount = 1;

    function getFarmCoffeeBatchCount(uint _farmUid) public view returns(uint count) {
        return farmToBatches[_farmUid].length;
    }

    function getCoffeeBatchById(uint _uid) public view returns(
        uint,
        uint,
        uint16,
        bytes32,
        bytes32,
        uint32,
        bool
    ){
        CoffeeBatch memory coffeeBatch = coffeeBatches[_uid];
        return(
            coffeeBatch.uid,
            coffeeBatch.farmUid,
            coffeeBatch.altitude,
            coffeeBatch.variety,
            coffeeBatch.process,
            coffeeBatch.size,
            coffeeBatch.isSold
        ); 
    }

    function addCoffeeBatch(uint _farmUid, uint16 _altitude, bytes32 _variety, bytes32 _process, uint32 _size) public {
     //   Action memory action = Action(msg.sender,"creation",_additionalInformation, _timestamp); 
        //Fixes memory error that doesn't allow to create memory objects in structs
        uint uid = coffeeBatchCount;
        CoffeeBatch memory coffeeBatch = CoffeeBatch(uid, _farmUid, _altitude, _variety, _process, _size, false);
        coffeeBatchCount++;
        coffeeBatches[uid] = coffeeBatch;
        farmToBatches[_farmUid].push(uid);
        emit LogAddCoffeeBatch(uid, _farmUid, _altitude, _variety, _process, _size, false);        
    }

    function updateCoffeeBatch(uint _coffeeUid, uint _farmUid, uint16 _altitude, bytes32 _variety, bytes32 _process, uint32 _size) public {
     //   Action memory action = Action(msg.sender,"creation",_additionalInformation, _timestamp); 
        //Fixes memory error that doesn't allow to create memory objects in structs
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeUid];
        coffeeBatch.farmUid = _farmUid;
        coffeeBatch.altitude = _altitude;
        coffeeBatch.variety = _variety;
        coffeeBatch.process = _process;
        coffeeBatch.size = _size;
        emit LogUpdateCoffeeBatch(_coffeeUid, _farmUid, _altitude, _variety, _process, _size, coffeeBatch.isSold);        
    }

    //TODO: pass to a util function
    function toBytes(uint256 x)  internal pure returns (bytes b) {
        b = new bytes(32);
        for (uint i = 0; i < 32; i++) {
            b[i] = byte(uint8(x / (2**(8*(31 - i))))); 
        }
    }


    //TODO
    //Handle same action
    //Update Action
    //Finish Process
    
} 