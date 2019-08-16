pragma solidity ^0.5.9;

/** @title Coffee Batch Factory.
  * @author Affogato
  */

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "./ActorFactory.sol";

/** TODO:
  * Should be able to burn coffeeBatch
  * Update coffee Batch to save more information of the state of the coffee, cherry, wet, etc.
  */

contract CoffeeBatchFactory is Ownable, Pausable {
    /** @notice Logs when a Coffee Batch is created. */
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

    /** @notice Logs when a Coffee Batch is created by a Cooperative. */
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

    /** @notice Logs when a Coffee Batch is updated. */
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

    /** @notice Logs when a Cooperative updates a Coffee Batch. */
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

    /** @notice Throws if called by any account not allowed. */
    modifier isAllowed(address _farmerAddress, address _target){
        require(actor.isAllowed(_farmerAddress, msg.sender), "not authorized");
        _;
    }

    /** @notice Throws if called by any account other than a cooperative. */
    modifier onlyCooperative(){
        require(actor.isCooperative(msg.sender), "not a cooperative");
        _;
    }

    /** @notice Throws if called by any account other than a farmer. */
    modifier onlyFarmer(){
        require(actor.isFarmer(msg.sender), "not a farmer");
        _;
    }

    /**@dev ActorFactory contract object */
    ActorFactory actor;

    /**@dev Coffee Batch struct object */
    struct CoffeeBatch {
        uint uid;
        address owner;
        uint farmUid;
        uint16 altitude;
        bytes32 variety;
        bytes32 process;
        uint32 size;  /** @dev QQ - Precision two decimals 100.00 */
        bool isSold; /** @dev used for creating NFT */
    }

    mapping(uint => CoffeeBatch) public coffeeBatches;
    mapping(uint => uint[]) public farmToBatches;
    // mapping(uint256 => CoffeeBatch) coffeeBatches;
    // uint256[] coffeeBatchIds;
    uint coffeeBatchCount = 1;

    /** @notice Constructor, sets the actor factory
      * @param _actorAddress contract address of ActorFactory
      */
    constructor(address payable _actorAddress) public {
        actor = ActorFactory(_actorAddress);
    }

    /** @notice Gets the number of coffee batches
      * @param _farmUid address of the farm to count
      * @return returns a uint with the amount of farms
      */
    function getFarmCoffeeBatchCount(uint _farmUid) public view returns (uint count) {
        return farmToBatches[_farmUid].length;
    }

    /** @notice Gets the data of the coffee batch by id.
      * @param _uid uint with the id of the farm.
      * @return the values of the coffee batch.
      */
    function getCoffeeBatchById(uint _uid) public view returns (
        uint,
        address,
        uint,
        uint16,
        bytes32,
        bytes32,
        uint32,
        bool
    ) {
        CoffeeBatch memory coffeeBatch = coffeeBatches[_uid];
        return (
            coffeeBatch.uid,
            coffeeBatch.owner,
            coffeeBatch.farmUid,
            coffeeBatch.altitude,
            coffeeBatch.variety,
            coffeeBatch.process,
            coffeeBatch.size,
            coffeeBatch.isSold
        );
    }

    /** @notice creates a new Coffee Batch
      * @param _farmUid uid of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      */
    function addCoffeeBatch(
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size
    ) public whenNotPaused {
        uint uid = coffeeBatchCount;
        CoffeeBatch memory coffeeBatch = CoffeeBatch(uid, msg.sender, _farmUid, _altitude, _variety, _process, _size, false);
        coffeeBatchCount++;
        coffeeBatches[uid] = coffeeBatch;
        farmToBatches[_farmUid].push(uid);
        emit LogAddCoffeeBatch(uid, msg.sender, _farmUid, _altitude, _variety, _process, _size, false);
    }

    /** @notice Cooperative creates a Coffee Batch.
      * @param _farmUid uid of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _farmerAddress address of the farmer.
      * @dev sender must be a cooperative and must be allowed
      */
    function cooperativeAddCoffeeBatch(
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        address _farmerAddress
    ) public whenNotPaused isAllowed(_farmerAddress, msg.sender) onlyCooperative {
        uint uid = coffeeBatchCount;
        CoffeeBatch memory coffeeBatch = CoffeeBatch(uid, _farmerAddress, _farmUid, _altitude, _variety, _process, _size, false);
        coffeeBatchCount++;
        coffeeBatches[uid] = coffeeBatch;
        farmToBatches[_farmUid].push(uid);
        emit LogCooperativeAddCoffeeBatch(uid, _farmerAddress, _farmUid, _altitude, _variety, _process, _size, false, msg.sender);
    }

    /** @notice updates a Coffee Batch.
      * @param _coffeeUid uid of the coffee batch
      * @param _farmUid uid of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @dev sender must be a cooperative and must be allowed
      */
    function updateCoffeeBatch(
        uint _coffeeUid,
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size
    ) public whenNotPaused {
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeUid];
        require(coffeeBatch.owner != address(0), "require coffee batch to exist");
        require(coffeeBatch.owner == msg.sender, "require sender to be the owner");
        coffeeBatch.farmUid = _farmUid;
        coffeeBatch.altitude = _altitude;
        coffeeBatch.variety = _variety;
        coffeeBatch.process = _process;
        coffeeBatch.size = _size;
        emit LogUpdateCoffeeBatch(_coffeeUid, _farmUid, msg.sender, _altitude, _variety, _process, _size, coffeeBatch.isSold);
    }

    /** @notice Cooperative updates a Coffee Batch.
      * @param _coffeeUid uid of the coffee batch
      * @param _farmUid uid of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _farmerAddress address of the farmer.
      * @dev sender must be a cooperative and must be allowed
      */
    function cooperativeUpdateCoffeeBatch(
        uint _coffeeUid,
        uint _farmUid,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        address _farmerAddress
    ) public whenNotPaused isAllowed(_farmerAddress, msg.sender) onlyCooperative {
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeUid];
        require(coffeeBatch.owner != address(0), "require coffee batch to exist");
        require(coffeeBatch.owner == _farmerAddress, "require the farmer to be the owner");
        coffeeBatch.farmUid = _farmUid;
        coffeeBatch.altitude = _altitude;
        coffeeBatch.variety = _variety;
        coffeeBatch.process = _process;
        coffeeBatch.size = _size;
        emit LogCooperativeUpdateCoffeeBatch(
            _coffeeUid,
            _farmUid,
            _farmerAddress,
            _altitude,
            _variety,
            _process,
            _size,
            coffeeBatch.isSold,
            msg.sender
        );
    }

    /** @notice Checks if actor is owner of a coffee batch
      * @param _owner address of the farmer.
      * @param _coffeeBatchId uint id of the coffee batch
      * @return a boolean with the status.
      */
    function actorIsOwner(address _owner, uint _coffeeBatchId) public view returns (bool) {
        CoffeeBatch memory coffeeBatch = coffeeBatches[_coffeeBatchId];
        if (coffeeBatch.owner == _owner) {
            return true;
        }
        return false;
    }

    /** @notice destroys contract
      * @dev Only Owner can call this method
      */
    function destroy() public onlyOwner {
        address payable owner = address(uint160(owner()));
        selfdestruct(owner);
    }

    /** @notice reverts if ETH is sent */
    function() external payable{
      revert("Contract can't receive Ether");
    }
}
