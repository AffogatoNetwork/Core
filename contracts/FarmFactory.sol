pragma solidity ^0.5.9;

/** @title Farm Factory.
  * @author Affogato
  */

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "./ActorFactory.sol";

/** TODO:
  * use zeppelin counter
  */

contract FarmFactory is Ownable, Pausable {

    /** @notice Logs when a Farm is created. */
    event LogAddFarm(
        uint indexed _id,
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string _story
    );

    /** @notice Logs when a Cooperative creates a Farm. */
    event LogCooperativeAddFarm(
        uint indexed _id,
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string _story,
        address _cooperativeAddress
    );

    /** @notice Logs when a Farm is updated. */
    event LogUpdateFarm(
        uint indexed _id,
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string _story
    );

    /** @notice Logs when a Cooperative updates a Farm. */
    event LogCooperativeUpdateFarm(
        uint indexed _id,
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string _story,
        address _cooperativeAddress
    );

    /** @notice Logs when a Farm is destroyed. */
    event LogDestroyFarm(
        address _actorAddress,
        uint _farmId
    );

    /** @notice Logs when a cooperative destroys a Farm. */
    event LogCooperativeDestroyFarm(
        address _cooperativeAddress,
        address _actorAddress,
        uint _farmId
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

    /**@dev Farm struct object */
    struct Farm {
        uint id;
        address ownerAddress;
        bytes32 name;
        bytes32 country;
        bytes32 region;
        bytes32 village;
        string story;
    }

    mapping(uint => Farm) public farms;
    uint farmsCount = 1;

    /** @notice Sets the actor factory
      * @param _actorFactoryAddress contract address of ActorFactory
      */
    constructor(address payable _actorFactoryAddress) public {
        actor = ActorFactory(_actorFactoryAddress);
    }

    /** @notice Gets the data of the farm by id.
      * @param _id uint with the id of the farm.
      * @return the values of the farm.
      */
    function getFarmById(uint _id) public view returns (
        uint,
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        string memory,
        address
    ) {
        Farm memory farm = farms[_id];
        return (
            farm.id,
            farm.name,
            farm.country,
            farm.region,
            farm.village,
            farm.story,
            farm.ownerAddress
        );
    }

    /** @notice Gets the address of the owner of a farm.
      * @param _id uint with the id of the farm.
      * @return address of the owner.
      */
    function getFarmOwner(uint _id) public view returns (address) {
        Farm memory farm = farms[_id];
        return farm.ownerAddress;
    }

    /** @notice creates a new farm
      * @param _ownerAddress address of the farmer.
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      */
    function _addFarm(
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story
    ) private whenNotPaused returns (uint) {
        uint id = farmsCount;
        Farm memory farm = Farm(id,_ownerAddress, _name, _country, _region, _village, _story);
        farms[id] = farm;
        farmsCount++;
        return id;
    }

    /** @notice creates a new farm
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      */
    function addFarm(
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story
    ) public whenNotPaused onlyFarmer {
        uint id = _addFarm(
          msg.sender,
          _name,
          _country,
          _region,
          _village,
          _story
        );
        emit LogAddFarm(id, msg.sender, _name, _country, _region, _village, _story);
    }

    /** @notice cooperative creates a new farm
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      * @param _farmerAddress address of farmer.
      * @dev sender must be a cooperative and must be allowed
      */
    function cooperativeAddFarm(
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story,
        address _farmerAddress
    ) public whenNotPaused isAllowed(_farmerAddress, msg.sender
    ) onlyCooperative {
        uint id = _addFarm(
          _farmerAddress,
          _name,
          _country,
          _region,
          _village,
          _story
        );
        emit LogCooperativeAddFarm(id,_farmerAddress, _name, _country, _region, _village, _story, msg.sender);
    }

    /** @notice updates a farm
      * @param _id id of the farm.
      * @param _ownerAddress address of farm owner.
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      */
    function _updateFarm(
        uint _id,
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story
    ) private whenNotPaused {
        require(farms[_id].name != 0, "require farm to exist");
        require(farms[_id].ownerAddress == _ownerAddress, "require sender to be the owner");
        Farm storage farm = farms[_id];
        farm.name = _name;
        farm.country = _country;
        farm.region = _region;
        farm.village = _village;
        farm.story = _story;
    }

    /** @notice updates a farm
      * @param _id id of the farm.
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      */
    function updateFarm(
        uint _id,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story
    ) public whenNotPaused {
        _updateFarm(_id, msg.sender, _name, _country, _region, _village, _story);
        emit LogUpdateFarm(_id, msg.sender, _name, _country, _region, _village, _story);
    }

    /** @notice cooperative updates a farm
      * @param _id id of the farm.
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      * @dev sender must be a cooperative and must be allowed
      */
    function cooperativeUpdateFarm(
        uint _id,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story
    ) public whenNotPaused isAllowed(farms[_id].ownerAddress, msg.sender) onlyCooperative {
        _updateFarm(_id, farms[_id].ownerAddress, _name, _country, _region, _village, _story);
        emit LogCooperativeUpdateFarm(_id, farms[_id].ownerAddress, _name, _country, _region, _village, _story, msg.sender);
    }

    /** @notice destroys a farm
      * @param _farmId uint id of the farm.
      * @dev only owner can destroy account
      */
    function _destroyFarm(uint _farmId) private whenNotPaused {
       delete farms[_farmId];
    }

    /** @notice destroys a farm
      * @param _farmId uint id of the farm.
      * @dev only owner can destroy a farm
      */
    function destroyFarm(uint _farmId) public whenNotPaused {
        require(farms[_farmId].ownerAddress == msg.sender, "require sender to be the owner");
        _destroyFarm(_farmId);
        emit LogDestroyFarm(msg.sender, _farmId);
    }

    /** @notice cooperative destroys a farm
      * @param _farmId uint id of the farm.
      * @dev only an allowed cooperative can destroy a farm
      */
    function cooperativeDestroyFarm(uint _farmId)
        public whenNotPaused onlyCooperative
        isAllowed(farms[_farmId].ownerAddress, msg.sender)
    {
        address farmerAddress = farms[_farmId].ownerAddress;
        _destroyFarm(_farmId);
        emit LogCooperativeDestroyFarm(msg.sender,farmerAddress, _farmId);
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
