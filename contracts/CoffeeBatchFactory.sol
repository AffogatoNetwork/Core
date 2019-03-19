pragma solidity ^0.5.0;

import './Libraries/Pausable.sol';
import "./ActorFactory.sol";

contract CoffeeBatchFactory is Ownable, Pausable {
    //TODO: add is coffee batch owner
    event LogAddCoffeeBatch(
        uint indexed _id,
        address _owner,
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bool _isSold
    );

    event LogCooperativeAddCoffeeBatch(
        uint indexed _id,
        address _owner,
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bool _isSold,
        address _cooperativeAddress
    );

    event LogUpdateCoffeeBatch(
        uint indexed _id,
        uint _farmUid,
        address _owner,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bool _isSold
    );

    event LogCooperativeUpdateCoffeeBatch(
        uint indexed _id,
        uint _farmUid,
        address _owner,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bool _isSold,
        address _cooperativeAddress
    );

    /**
     * @dev Throws if called by any account not allowed.
     */
    modifier isAllowed(address _farmerAddress, address _target){
        require(actor.isAllowed(_farmerAddress, msg.sender), "not authorized");
        _;
    }

    /**
     * @dev Throws if called by any account other than a cooperative.
     */
    modifier isCooperative(){
         bytes32 actorType = bytes32("cooperative");
        require(actor.getAccountType(msg.sender) == actorType, "not a cooperative");
        _;
    }

     ActorFactory actor;

    struct CoffeeBatch {
        uint uid;
        address owner;
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

    constructor(address _actorAddress) public {
        actor = ActorFactory(_actorAddress);
    }


    function getFarmCoffeeBatchCount(uint _farmUid) public view returns (uint count) {
        return farmToBatches[_farmUid].length;
    }

    function getCoffeeBatchById(uint _uid) public view returns (uint, address, uint, uint16, bytes32, bytes32, uint32, bool) {
        CoffeeBatch memory coffeeBatch = coffeeBatches[_uid];
        return (coffeeBatch.uid, coffeeBatch.owner, coffeeBatch.farmUid, coffeeBatch.altitude, coffeeBatch.variety, coffeeBatch.process, coffeeBatch.size, coffeeBatch.isSold);
    }

    function addCoffeeBatch(uint _farmUid, uint16 _altitude, bytes32 _variety, bytes32 _process, uint32 _size) public whenNotPaused {
        //   Action memory action = Action(msg.sender,"creation",_additionalInformation, _timestamp);
        //Fixes memory error that doesn't allow to create memory objects in structs
        uint uid = coffeeBatchCount;
        CoffeeBatch memory coffeeBatch = CoffeeBatch(uid, msg.sender, _farmUid, _altitude, _variety, _process, _size, false);
        coffeeBatchCount++;
        coffeeBatches[uid] = coffeeBatch;
        farmToBatches[_farmUid].push(uid);
        emit LogAddCoffeeBatch(uid, msg.sender, _farmUid, _altitude, _variety, _process, _size, false);
    }

    function cooperativeAddCoffeeBatch(uint _farmUid, uint16 _altitude, bytes32 _variety, bytes32 _process, uint32 _size, address _farmerAddress) public whenNotPaused isAllowed(_farmerAddress, msg.sender) isCooperative {
        uint uid = coffeeBatchCount;
        CoffeeBatch memory coffeeBatch = CoffeeBatch(uid, _farmerAddress, _farmUid, _altitude, _variety, _process, _size, false);
        coffeeBatchCount++;
        coffeeBatches[uid] = coffeeBatch;
        farmToBatches[_farmUid].push(uid);
        emit LogCooperativeAddCoffeeBatch(uid, _farmerAddress, _farmUid, _altitude, _variety, _process, _size, false, msg.sender);
    }

    function updateCoffeeBatch(uint _coffeeUid, uint _farmUid, uint16 _altitude, bytes32 _variety, bytes32 _process, uint32 _size) public whenNotPaused {
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeUid];
        require(coffeeBatch.owner == msg.sender, "not owner");
        coffeeBatch.farmUid = _farmUid;
        coffeeBatch.altitude = _altitude;
        coffeeBatch.variety = _variety;
        coffeeBatch.process = _process;
        coffeeBatch.size = _size;
        emit LogUpdateCoffeeBatch(_coffeeUid, _farmUid, msg.sender, _altitude, _variety, _process, _size, coffeeBatch.isSold);
    }

     function cooperativeUpdateCoffeeBatch(uint _coffeeUid, uint _farmUid, uint16 _altitude, bytes32 _variety, bytes32 _process, uint32 _size, address _farmerAddress) public whenNotPaused isAllowed(_farmerAddress, msg.sender) isCooperative {
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeUid];
        coffeeBatch.farmUid = _farmUid;
        coffeeBatch.altitude = _altitude;
        coffeeBatch.variety = _variety;
        coffeeBatch.process = _process;
        coffeeBatch.size = _size;
        emit LogCooperativeUpdateCoffeeBatch(_coffeeUid, _farmUid, _farmerAddress, _altitude, _variety, _process, _size, coffeeBatch.isSold,msg.sender);
    }

    function actorIsOwner(address _owner, uint _coffeeBatchId) public view returns (bool) {
        CoffeeBatch memory coffeeBatch = coffeeBatches[_coffeeBatchId];
        if (coffeeBatch.owner == _owner) {
            return true;
        }
        return false;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
