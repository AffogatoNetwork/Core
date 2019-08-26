pragma solidity ^0.5.9;

/** @title Coffee Batch Factory.
  * @author Affogato
  */

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "./IActor.sol";
import "./FarmFactory.sol";

contract CoffeeBatchFactory is Ownable, Pausable {
    /** @notice Logs when a Coffee Batch is created. */
    event LogAddCoffeeBatch(
        uint indexed _id,
        address _owner,
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string _additionalInformation
    );

    /** @notice Logs when a Coffee Batch is created by a Cooperative. */
    event LogCooperativeAddCoffeeBatch(
        uint indexed _id,
        address _owner,
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string _additionalInformation,
        address _cooperativeAddress
    );

    /** @notice Logs when a Coffee Batch is updated. */
    event LogUpdateCoffeeBatch(
        uint indexed _id,
        uint _farmId,
        address _owner,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string _additionalInformation
    );

    /** @notice Logs when a Cooperative updates a Coffee Batch. */
    event LogCooperativeUpdateCoffeeBatch(
        uint indexed _id,
        uint _farmId,
        address _owner,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string _additionalInformation,
        address _cooperativeAddress
    );

    /** @notice Logs when a Coffee Batch is destroyed. */
    event LogDestroyCoffeeBatch(
        address _actorAddress,
        uint _id
    );

    /** @notice Logs when a Cooperative destroys a Coffee Batch. */
    event LogCooperativeDestroyCoffeeBatch(
        address _cooperativeAddress,
        address _actorAddress,
        uint _coffeeBatchId
    );

    /** @notice Throws if called by any account not allowed.
      * @param _farmerAddress address of the farmer
      * @param _target address of the cooperative or technician
      */
    modifier isAllowed(address _farmerAddress, address _target){
        require(actor.isAllowed(_farmerAddress, msg.sender), "not authorized");
        _;
    }

    /** @notice Throws if called by any account other than a cooperative. */
    modifier onlyCooperative(){
        require(actor.isCooperative(msg.sender), "not a cooperative");
        _;
    }

    /** @notice Throws if called by any account other than a farmer and the owner of the farm.
      * @param _farmId uint id of the farm
      * @param _farmerAddress uint id of the farm
      */
    modifier onlyFarmer(uint _farmId, address _farmerAddress){
        require(actor.isFarmer(_farmerAddress), "not a farmer");
        require(farm.getFarmOwner(_farmId) == _farmerAddress, "not the owner of the farm");
        _;
    }

    /** @notice Throws if called by any account other than a coffee batch owner
      * @param _coffeeBatchId id of the certificate
      * @param _farmerAddress address of the coffee batch owner
      */
    modifier onlyCoffeeBatchOwner(uint _coffeeBatchId, address _farmerAddress){
        require(coffeeBatches[_coffeeBatchId].ownerAddress == _farmerAddress, "require sender to be the owner");
        _;
    }

    /**@dev ActorFactory contract object */
    IActor actor;
    /**@dev FarmFactory contract object */
    FarmFactory farm;

    /**@dev Coffee Batch struct object */
    struct CoffeeBatch {
        uint id;
        address ownerAddress;
        uint farmId;
        uint16 altitude;
        bytes32 variety;
        bytes32 process;
        uint32 size;  /** @dev QQ - Precision two decimals 100.00 */
        bytes32 coffeeState;
        string additionalInformation; /** @dev String used to save additional information */
    }

    /**@dev Mapping of coffee batches by id */
    mapping(uint => CoffeeBatch) public coffeeBatches;
    uint coffeeBatchCount = 1;

    /** @notice Constructor, sets the actor factory
      * @param _actorFactoryAddress contract address of ActorFactory
      * @param _farmFactoryAddress contract address of FarmFactory
      */
    constructor(IActor _actorFactoryAddress, address payable _farmFactoryAddress) public {
        actor = IActor(_actorFactoryAddress);
        farm = FarmFactory(_farmFactoryAddress);
    }

    /** @notice Gets the data of the coffee batch by id.
      * @param _coffeeBatchId uint with the id of the farm.
      * @return the values of the coffee batch.
      */
    function getCoffeeBatchById(uint _coffeeBatchId) public view returns (
        uint,
        address,
        uint,
        uint16,
        bytes32,
        bytes32,
        uint32,
        bytes32,
        string memory
    ) {
        CoffeeBatch memory coffeeBatch = coffeeBatches[_coffeeBatchId];
        return (
            coffeeBatch.id,
            coffeeBatch.ownerAddress,
            coffeeBatch.farmId,
            coffeeBatch.altitude,
            coffeeBatch.variety,
            coffeeBatch.process,
            coffeeBatch.size,
            coffeeBatch.coffeeState,
            coffeeBatch.additionalInformation
        );
    }

    /** @notice Gets the address of the owner of a coffee batch by id.
      * @param _coffeeBatchId uint with the id of the farm.
      * @return the values of the coffee batch.
      */
    function getCoffeeBatchOwner(uint _coffeeBatchId) public view returns (
        address
    ) {
        CoffeeBatch memory coffeeBatch = coffeeBatches[_coffeeBatchId];
        return coffeeBatch.ownerAddress;
    }

    /** @notice creates a new Coffee Batch\
      * @param _ownerAddress address of the farmer.
      * @param _farmId id of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _coffeeState bytes32 with the coffee state
      * @param _additionalInformation json string with additional information of the coffee
      */
    function _addCoffeeBatch(
        address _ownerAddress,
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string memory _additionalInformation
    ) private whenNotPaused returns(uint){
        uint coffeeBatchId = coffeeBatchCount;
        CoffeeBatch memory coffeeBatch = CoffeeBatch(
            coffeeBatchId,
            _ownerAddress,
            _farmId,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation
        );
        coffeeBatchCount++;
        coffeeBatches[coffeeBatchId] = coffeeBatch;
        return coffeeBatchId;
    }

    /** @notice creates a new Coffee Batch
      * @param _farmId id of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _coffeeState bytes32 with the coffee state
      * @param _additionalInformation json string with additional information of the coffee
      */
    function addCoffeeBatch(
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string memory _additionalInformation
    ) public whenNotPaused onlyFarmer(_farmId, msg.sender){
        uint id = _addCoffeeBatch(
            msg.sender,
            _farmId,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation
        );
        emit LogAddCoffeeBatch(
            id,
            msg.sender,
            _farmId,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation
        );
    }

    /** @notice Cooperative creates a Coffee Batch.
      * @param _farmId id of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _coffeeState bytes32 with the coffee state
      * @param _additionalInformation json string with additional information of the coffee
      * @param _farmerAddress address of the farmer.
      * @dev sender must be a cooperative and must be allowed
      */
    function cooperativeAddCoffeeBatch(
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string memory _additionalInformation,
        address _farmerAddress
    ) public whenNotPaused isAllowed(_farmerAddress, msg.sender) onlyCooperative onlyFarmer(_farmId, _farmerAddress){
        uint coffeeBatchId = _addCoffeeBatch(
            _farmerAddress,
            _farmId,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation
        );
        emit LogCooperativeAddCoffeeBatch(
            coffeeBatchId,
            _farmerAddress,
            _farmId,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation,
            msg.sender
        );
    }

    /** @notice updates a Coffee Batch.
      * @param _coffeeBatchId id of the coffee batch
      * @param _ownerAddress address of the coffee batch owner
      * @param _farmId id of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _coffeeState bytes32 with the coffee state
      * @param _additionalInformation json string with additional information of the coffee
      * @dev sender must owner and a farmer
      */
    function _updateCoffeeBatch(
        uint _coffeeBatchId,
        address _ownerAddress,
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string memory _additionalInformation
    ) public whenNotPaused onlyCoffeeBatchOwner(_coffeeBatchId, _ownerAddress) {
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeBatchId];
        require(coffeeBatch.ownerAddress != address(0), "require coffee batch to exist");
        coffeeBatch.farmId = _farmId;
        coffeeBatch.altitude = _altitude;
        coffeeBatch.variety = _variety;
        coffeeBatch.process = _process;
        coffeeBatch.coffeeState = _coffeeState;
        coffeeBatch.additionalInformation = _additionalInformation;
        coffeeBatch.size = _size;
    }

    /** @notice updates a Coffee Batch.
      * @param _coffeeBatchId id of the coffee batch
      * @param _farmId id of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _coffeeState bytes32 with the coffee state
      * @param _additionalInformation json string with additional information of the coffee
      * @dev sender must owner and a farmer
      */
    function updateCoffeeBatch(
        uint _coffeeBatchId,
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string memory _additionalInformation
    ) public whenNotPaused {
        _updateCoffeeBatch(
            _coffeeBatchId,
            msg.sender,
            _farmId,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation
        );
        emit LogUpdateCoffeeBatch(
            _coffeeBatchId,
            _farmId,
            msg.sender,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation
        );
    }

    /** @notice Cooperative updates a Coffee Batch.
      * @param _coffeeBatchId coffeeBatchId of the coffee batch
      * @param _farmId coffeeBatchId of the farm.
      * @param _altitude altitude of the farm.
      * @param _variety variety of the coffee.
      * @param _process process of the coffee.
      * @param _size batch size of the coffee in QQ.
      * @param _coffeeState bytes32 with the coffee state
      * @param _additionalInformation json string with additional information of the coffee
      * @dev sender must be a cooperative and must be allowed
      */
    function cooperativeUpdateCoffeeBatch(
        uint _coffeeBatchId,
        uint _farmId,
        uint16 _altitude,
        bytes32 _variety,
        bytes32 _process,
        uint32 _size,
        bytes32 _coffeeState,
        string memory _additionalInformation
    ) public whenNotPaused isAllowed(coffeeBatches[_coffeeBatchId].ownerAddress, msg.sender) onlyCooperative {
        _updateCoffeeBatch(
            _coffeeBatchId,
            coffeeBatches[_coffeeBatchId].ownerAddress,
            _farmId,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation
        );
        emit LogCooperativeUpdateCoffeeBatch(
            _coffeeBatchId,
            _farmId,
            coffeeBatches[_coffeeBatchId].ownerAddress,
            _altitude,
            _variety,
            _process,
            _size,
            _coffeeState,
            _additionalInformation,
            msg.sender
        );
    }

    /** @notice destroys a coffee Batch
      * @param _coffeeBatchId uint id of the coffee batch.
      * @dev only owner can destroy account
      */
    function _destroyCoffeeBatch(uint _coffeeBatchId) private whenNotPaused {
       delete coffeeBatches[_coffeeBatchId];
    }

    /** @notice destroys a coffee Batch
      * @param _coffeeBatchId uint id of the coffee batch.
      * @dev only owner can destroy a farm
      */
    function destroyCoffeeBatch(uint _coffeeBatchId) public whenNotPaused onlyCoffeeBatchOwner(_coffeeBatchId, msg.sender) {
        _destroyCoffeeBatch(_coffeeBatchId);
        emit LogDestroyCoffeeBatch(msg.sender, _coffeeBatchId);
    }

    /** @notice cooperative destroys a coffee Batch
      * @param _coffeeBatchId uint id of the coffee batch.
      * @dev only cooperative can destroy a farm
      */
    function cooperativeDestroyCoffeeBatch(uint _coffeeBatchId)
    public isAllowed(coffeeBatches[_coffeeBatchId].ownerAddress, msg.sender) onlyCooperative whenNotPaused {
        address farmerAddress = coffeeBatches[_coffeeBatchId].ownerAddress;
        _destroyCoffeeBatch(_coffeeBatchId);
        emit LogCooperativeDestroyCoffeeBatch(msg.sender, farmerAddress, _coffeeBatchId);
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
