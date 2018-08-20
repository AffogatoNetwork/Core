pragma solidity ^0.4.23;

contract Coffee{

    event LogAddCoffeeBatch(bytes32 indexed _id);
     
    struct CoffeeBatch{
        bytes32 uid;
        bytes32 farmUid;
        uint16 altitude;
        bytes32 variety;
        bytes32 process;
        //QQ - Precision two decimals 100.00
        uint32 size;
        bool isSold;  
    }

   mapping(bytes32 => CoffeeBatch) public coffeeBatches;
   mapping(bytes32 => bytes32[]) public farmToBatches;
   // mapping(uint256 => CoffeeBatch) coffeeBatches;
   // uint256[] coffeeBatchIds;
   uint coffeeBatchCount = 0;

    function getFarmCoffeeBatchCount(bytes32 _farmUid) public view returns(uint count) {
        return farmToBatches[_farmUid].length;
    }

    function getCoffeeBatchById(bytes32 _uid) public view returns(
        bytes32,
        bytes32,
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

    function addCoffeeBatch(bytes32 _farmUid, uint16 _altitude, bytes32 _variety, bytes32 _process, uint32 _size) public {
     //   Action memory action = Action(msg.sender,"creation",_additionalInformation, _timestamp); 
        //Fixes memory error that doesn't allow to create memory objects in structs
        bytes32 uid = keccak256(toBytes(coffeeBatchCount));
        CoffeeBatch memory coffeeBatch = CoffeeBatch(uid, _farmUid, _altitude, _variety, _process, _size, false);
        coffeeBatchCount++;
        coffeeBatches[uid] = coffeeBatch;
        farmToBatches[_farmUid].push(uid);
        emit LogAddCoffeeBatch(uid);        
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