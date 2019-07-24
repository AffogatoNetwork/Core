pragma solidity ^0.5.0;

/** @title Actor Factory.
    @author Affogato
 */

import './Libraries/Pausable.sol';

/** TODO:
 * Approve should work like ERC Standard
 * Id, Name, Country, Region, Email, Image Hash and Bio aren't needed on the blockchain
 * Cooperative Update Actor
 */

contract ActorFactory is Ownable, Pausable {
    /** @notice Logs when an Actor is created. */
    event LogAddActor(
        address indexed _id,
        bytes32 _name,
        bytes32 _typeOfActor,
        bytes32 _country,
        bytes32 _region,
        bytes32 _email,
        string _imageHash,
        string _bio
    );

    /** @notice Logs when a cooperative creates an Actor. */
    event LogCooperativeAddActor(
        address indexed _id,
        bytes32 _name,
        bytes32 _typeOfActor,
        bytes32 _country,
        bytes32 _region,
        bytes32 _email,
        string _imageHash,
        string _bio,
        address _cooperativeAddress
    );

    /** @notice Logs when an Actor is updated. */
    event LogUpdateActor(
        address indexed _id,
        bytes32 _name,
        bytes32 _typeOfActor,
        bytes32 _country,
        bytes32 _region,
        bytes32 _email,
        string _imageHash,
        string _bio
    );

    /** @notice Logs when an Actor gives permission. */
    event LogApproval(
        address indexed _owner,
        address indexed _allowed,
        bool _value
    );

    /** @notice Logs when a Cooperative approves for an Actor. */
    event LogCooperativeApproval(
        address indexed _owner,
        address indexed _allowed,
        bool _value,
        address _cooperativeAddress
    );

    /** @notice Throws if called by any account other than a cooperative. */
    modifier isCooperative(){
         bytes32 actorType = bytes32("cooperative");
        require(getAccountType(msg.sender) == actorType, "not a cooperative");
        _;
    }

    struct Actor {
        bytes32 name;
        bytes32 typeOfActor;
        bytes32 country;
        bytes32 region;
        bytes32 email;
        string imageHash;
        string bio;
    }

    mapping(address => Actor) public addressToActor;
    address[] public actorsIds;
    mapping(address => mapping(address => bool)) private allowed_;

    /** @notice Gets the number of Actors
      * @return returns a uint with the amount of the actors
      */
    function getActorCount() public view returns (uint count) {
        return actorsIds.length;
    }

    /** @notice Creates a profile with user basic information.
      * @param _owner address of the owner.
      * @return returns a uint with the amount of the actors
      */
    function getAccountType(address _owner) public view returns (bytes32) {
        return addressToActor[_owner].typeOfActor;
    }

    /** @notice Checks if a user has permission from another user.
      * @param _allower address of the allower.
      * @param _allowed address of the actor to check if has permission.
      * @return returns a boolean if it has permission.
      */
    function isAllowed(address _allower, address _allowed) public view returns (bool) {
        return allowed_[_allower][_allowed];
    }

    /** @notice Checks if message sender is the owner.
      * @return the values of the actor.
      * ! @dev this method is going to be deprecated on new version
      */
    function returnOwner() public view returns (
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        string memory,
        string memory
    ) {
        Actor memory actor = addressToActor[msg.sender];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email, actor.imageHash, actor.bio);
    }

    /** @notice Gets the data of the actor.
      * @param _actorAddress address of the actor.
      * @return the values of the actor.
      * ! @dev this method is going to be deprecated on new version
      */
    function getActor(address _actorAddress) public view returns (
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        string memory,
        string memory
    ) {
        Actor memory actor = addressToActor[_actorAddress];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email, actor.imageHash, actor.bio);
    }

    /** @notice creates a new actor
      * @param _name name of the actor.
      * @param _typeOfActor type of account of the actor.
      * @param _country country of the actor.
      * @param _region region of the actor.
      * @param _email email of the actor.
      * @param _imageHash hash of the image saved on ipfs of the actor.
      * @param _bio bio of the actor.
      * ! @dev this method is going to be deprecated on new version
      */
    function addActor(
        bytes32 _name,
        bytes32 _typeOfActor,
        bytes32 _country,
        bytes32 _region,
        bytes32 _email,
        string memory _imageHash,
        string memory _bio
    ) public whenNotPaused {
        require(addressToActor[msg.sender].name == 0, "actor shouldn't exist");
        Actor memory actor = Actor(_name,_typeOfActor, _country, _region, _email, _imageHash, _bio);
        addressToActor[msg.sender] = actor;
        actorsIds.push(msg.sender);
        emit LogAddActor(msg.sender, _name, _typeOfActor, _country, _region, _email,_imageHash, _bio);
    }

    /** @notice Cooperative creates new actor
      * @param _name name of the actor.
      * @param _typeOfActor type of account of the actor.
      * @param _country country of the actor.
      * @param _region region of the actor.
      * @param _email email of the actor.
      * @param _imageHash hash of the image saved on ipfs of the actor.
      * @param _bio bio of the actor.
      * @param _owner address of the actor.
      * @dev Only Cooperatives can call this method
      * ! @dev this method is going to be deprecated on new version
      */
    function cooperativeAddActor(
        bytes32 _name,
        bytes32 _typeOfActor,
        bytes32 _country,
        bytes32 _region,
        bytes32 _email,
        string memory _imageHash,
        string memory _bio,
        address _owner
    ) public whenNotPaused isCooperative {
        require(addressToActor[_owner].name == 0, "actor shouldn't exist");
        Actor memory actor = Actor(_name, _typeOfActor, _country, _region, _email, _imageHash, _bio);
        addressToActor[_owner] = actor;
        actorsIds.push(_owner);
        allowed_[_owner][msg.sender] = true;
        emit LogCooperativeAddActor(_owner, _name, _typeOfActor, _country, _region, _email,_imageHash, _bio, msg.sender);
        emit LogApproval(_owner, msg.sender, true);
    }

    /** @notice creates a new actor
      * @param _name name of the actor.
      * @param _typeOfActor type of account of the actor.
      * @param _country country of the actor.
      * @param _region region of the actor.
      * @param _email email of the actor.
      * @param _imageHash hash of the image saved on ipfs of the actor.
      * @param _bio bio of the actor.
      * ! @dev this method is going to be deprecated on new version
      */
    function updateActor(
        bytes32 _name,
        bytes32 _typeOfActor,
        bytes32 _country,
        bytes32 _region,
        bytes32 _email,
        string memory _imageHash,
        string memory _bio
    ) public whenNotPaused {
        require(!(addressToActor[msg.sender].name == 0), "Actor should exist");
        Actor memory actor = addressToActor[msg.sender];
        actor.name = _name;
        actor.typeOfActor = _typeOfActor;
        actor.country = _country;
        actor.region = _region;
        actor.email = _email;
        actor.imageHash = _imageHash;
        actor.bio = _bio;
        addressToActor[msg.sender] = actor;
        emit LogUpdateActor(msg.sender, _name, _typeOfActor, _country, _region, _email,_imageHash,_bio);
    }

    /** @notice approves actor
      * @param _allowed address of actor to assign the permission.
      * @param _value value to be set.
      * @return true if is success
      */
    function approve(address _allowed, bool _value) public whenNotPaused returns (bool) {
        allowed_[msg.sender][_allowed] = _value;
        emit LogApproval(msg.sender, _allowed, _value);
        return true;
    }

    /** @notice approves actor
      * @param _allower address of actor to giving the permission.
      * @param _allowed address of actor to assign the permission.
      * @param _value value to be set.
      * @return true if is success
      * @dev Only Cooperatives can call this method
      */
    function cooperativeApprove(address allower, address _allowed, bool _value) public whenNotPaused isCooperative returns (bool) {
        allowed_[allower][_allowed] = _value;
        emit LogCooperativeApproval(allower, _allowed, _value, msg.sender);
        return true;
    }

    /** @notice destroys contract
      * @dev Only Owner can call this method
      */
    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
