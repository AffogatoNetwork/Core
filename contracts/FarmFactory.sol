pragma solidity ^0.5.9;

/** @title Farm Factory.
  * @author Affogato
  */

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "./ActorFactory.sol";

/** TODO:
  * Should be able to burn farms
  * Only Farmers should create farms
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
        uint uid;
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
      * @param _actorAddress contract address of ActorFactory
      */
    constructor(address payable _actorAddress) public {
        actor = ActorFactory(_actorAddress);
    }

    /** @notice Gets the data of the farm by id.
      * @param _uid uint with the id of the farm.
      * @return the values of the farm.
      */
    function getFarmById(uint _uid) public view returns (
        uint,
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        string memory,
        address
    ) {
        Farm memory farm = farms[_uid];
        return (
            farm.uid,
            farm.name,
            farm.country,
            farm.region,
            farm.village,
            farm.story,
            farm.ownerAddress
        );
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
        uint uid = farmsCount;
        Farm memory farm = Farm(uid,msg.sender, _name, _country, _region, _village, _story);
        farms[uid] = farm;
        farmsCount++;
        emit LogAddFarm(uid, msg.sender, _name, _country, _region, _village, _story);
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
        uint uid = farmsCount;
        Farm memory farm = Farm(uid, _farmerAddress, _name, _country, _region, _village, _story);
        farms[uid] = farm;
        farmsCount++;
        emit LogCooperativeAddFarm(uid,_farmerAddress, _name, _country, _region, _village, _story, msg.sender);
    }

    /** @notice updates a farm
      * @param _uid id of the farm.
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      */
    function updateFarm(
        uint _uid,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story
    ) public whenNotPaused {
        require(farms[_uid].name != 0, "require farm to exist");
        require(farms[_uid].ownerAddress == msg.sender, "require sender to be the owner");
        Farm storage farm = farms[_uid];
        farm.name = _name;
        farm.country = _country;
        farm.region = _region;
        farm.village = _village;
        farm.story = _story;
        emit LogUpdateFarm(_uid, farm.ownerAddress, _name, _country, _region, _village, _story);
    }

    /** @notice cooperative updates a farm
      * @param _uid id of the farm.
      * @param _name name of the farm.
      * @param _country country of the farm.
      * @param _region region of the farm.
      * @param _village village of the farm.
      * @param _story story of the farm.
      * @dev sender must be a cooperative and must be allowed
      */
    function cooperativeUpdateFarm(
        uint _uid,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village,
        string memory _story,
        address _farmerAddress
    ) public whenNotPaused isAllowed(_farmerAddress, msg.sender) onlyCooperative {
        require(farms[_uid].name != 0, "require farm to exist");
        require(farms[_uid].ownerAddress == _farmerAddress, "require the farmer to be the owner");
        Farm storage farm = farms[_uid];
        farm.name = _name;
        farm.country = _country;
        farm.region = _region;
        farm.village = _village;
        farm.story = _story;
        emit LogCooperativeUpdateFarm(_uid, farm.ownerAddress, _name, _country, _region, _village, _story, msg.sender);
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
