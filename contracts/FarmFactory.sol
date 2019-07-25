pragma solidity ^0.5.0;

/** @title Actor Factory.
 *  @author Affogato
 */

import './Libraries/Pausable.sol';
import "./ActorFactory.sol";

/** TODO:
 * Approve should work like ERC Standard
 * Should work as ERC-721
 */

contract FarmFactory  is Ownable, Pausable {
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

    /**
     * @notice Throws if called by any account not allowed.
     */
    modifier isAllowed(address _farmerAddress, address _target){
        require(actor.isAllowed(_farmerAddress, msg.sender), "not authorized");
        _;
    }

    /**
     * @notice Throws if called by any account other than a cooperative.
     */
    modifier isCooperative(){
         bytes32 actorType = bytes32("cooperative");
        require(actor.getAccountType(msg.sender) == actorType, "not a cooperative");
        _;
    }

    ActorFactory actor;

    //Farms
    struct Farm {
        uint uid;
        address ownerAddress;
        bytes32 name;
        bytes32 country;
        bytes32 region;
        bytes32 village;
        string story;
    }

    mapping(address => uint[]) public farmerToFarms;
    mapping(uint => Farm) public farms;
    uint farmsCount = 1;

    /**
     * @notice Sets the actor factory
     * @param _actorAddress contract address of ActorFactory
     */
    constructor(address _actorAddress) public {
        actor = ActorFactory(_actorAddress);
    }

    /** @notice Gets the number of Farms
      * @param _farmer address of the farmer to count
      * @return returns a uint with the amount of farms
      */
    function getFarmersFarmsCount(address _farmer) public view returns (uint) {
        return farmerToFarms[_farmer].length;
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
    ) public whenNotPaused {
        uint uid = farmsCount;
        Farm memory farm = Farm(uid,msg.sender, _name, _country, _region, _village, _story);
        farmerToFarms[msg.sender].push(uid);
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
    ) isCooperative {
        uint uid = farmsCount;
        Farm memory farm = Farm(uid, _farmerAddress, _name, _country, _region, _village, _story);
        farmerToFarms[_farmerAddress].push(uid);
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
    ) public whenNotPaused isAllowed(_farmerAddress, msg.sender) isCooperative {
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

    /** @notice destroys contract
      * @dev Only Owner can call this method
      */
    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
