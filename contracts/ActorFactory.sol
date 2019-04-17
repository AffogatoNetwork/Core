pragma solidity ^0.5.0;

import './Libraries/Pausable.sol';

/// @author Affogato Team
/// @title Contract for managing coffee value chain actors
//TODO: Stop contract from receiving ether
contract ActorFactory is Ownable, Pausable {
    
    /** 
     * @notice Logs when an Actor is created.
     */
    event LogAddActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string _imageHash, string _bio);
   
    /** 
     * @notice Logs when a cooperative creates an Actor.
     */
    event LogCooperativeAddActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string _imageHash, string _bio, address _cooperativeAddress);

    /** 
     * @notice Logs when an Actor is updated.
     */
    event LogUpdateActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email,string _imageHash, string _bio);

    /** 
     * @notice Logs when an Actor approves another actor.
     */
    event LogApproval(address indexed _owner, address indexed _allowed, bool _value);

    /** 
     * @notice Logs when a cooperative makes an approval for an Actor.
     */
    event LogCooperativeApproval(address indexed _owner, address indexed _allowed, bool _value, address _cooperativeAddress);

    /**
     * @dev Throws if called by any account other than a cooperative.
     */
    modifier isCooperative(){
         bytes32 actorType = bytes32("cooperative");
        require(getAccountType(msg.sender) == actorType, "not a cooperative");
        _;
    }

    /**
     * @dev Actor object with personal information.
     */
    //TODO: Evaluate personal data to be saved on chain
    struct Actor {
        bytes32 name;
        bytes32 typeOfActor;
        bytes32 country;
        bytes32 region;
        bytes32 email;
        string imageHash;
        string bio;
    }

    /**
     * @dev Mapping of actors by address.
     */
    mapping(address => Actor) public addressToActor;
    /**
     * @dev Array of actors by id. 
     */
    //TODO: it's really needed?
    address[] public actorsIds;

    /**
     * @dev Mapping of actors with permissions of other actors by address.
     */
    mapping(address => mapping(address => bool)) private allowed_;

    /** @notice Gets the total of actors.
      * @return length of array.
      */
    //TODO: It's really needed?
    function getActorCount() public view returns (uint count) {
        return actorsIds.length;
    }

    /** @notice Gets the type of account created by the actor.
      * @param _owner address of account.
      * @return byte32 string with the account type.
      */
    function getAccountType(address _owner) public view returns (bytes32) {
        return addressToActor[_owner].typeOfActor;
    }

    /** @notice Checks if the _owner has given permision to the _target.
      * @param _owner address of the owner.
      * @param _target address of target.
      * @return true if it has permission.
      */
    function isAllowed(address _owner, address _target) public view returns (bool) {
        return allowed_[_owner][_target];
    }

    /** @notice Gets the information on the caller.
      * @return All the Actor information of the caller.
      */
    function returnOwner() public view returns (bytes32, bytes32, bytes32, bytes32, bytes32, string memory, string memory) {
        Actor memory actor = addressToActor[msg.sender];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email, actor.imageHash, actor.bio);
    }

    /** @notice Gets the information of the _actorAddress.
      * @param _actorAddress address of the actor.
      * @return All the Actor information.
      */
    function getActor(address _actorAddress) public view returns (bytes32, bytes32, bytes32, bytes32, bytes32,string memory,string memory) {
        Actor memory actor = addressToActor[_actorAddress];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email, actor.imageHash, actor.bio);
    }

    /** @notice Creates an Actor of the caller.
      * @param _name name of the actor.
      * @param _typeOfActor type of account of the actor.
      * @param _country country of the actor.
      * @param _region region of the actor.
      * @param _email email of the actor.
      * @param _imageHash image hash of the profile picture saved on IPFS.
      * @param _bio short bio of the actor.
      * @dev Logs the actor created.
      */
    function addActor(bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string memory _imageHash, string memory _bio) public whenNotPaused {
        require(addressToActor[msg.sender].name == 0);
        Actor memory actor = Actor(_name, _typeOfActor, _country, _region, _email, _imageHash, _bio);
        addressToActor[msg.sender] = actor;
        actorsIds.push(msg.sender);
        emit LogAddActor(msg.sender, _name, _typeOfActor, _country, _region, _email,_imageHash, _bio);
    }

    /** @notice The Cooperative creates a farmer actor and the gives permission to the cooperative.
      * @param _name name of the actor.
      * @param _typeOfActor type of account of the actor.
      * @param _country country of the actor.
      * @param _region region of the actor.
      * @param _email email of the actor.
      * @param _imageHash image hash of the profile picture saved on IPFS.
      * @param _bio short bio of the actor.
      * @param _owner address of the actor to be created.
      * @dev Logs the actor created and the approval.
      */
    function cooperativeAddActor(bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string memory _imageHash, string memory _bio, address _owner) public whenNotPaused isCooperative {
        require(addressToActor[_owner].name == 0);
        Actor memory actor = Actor(_name, _typeOfActor, _country, _region, _email, _imageHash, _bio);
        addressToActor[_owner] = actor;
        actorsIds.push(_owner);
        allowed_[_owner][msg.sender] = true;
        emit LogCooperativeAddActor(_owner, _name, _typeOfActor, _country, _region, _email,_imageHash, _bio, msg.sender);
        emit LogApproval(_owner, msg.sender, true);
    }

    /** @notice Updates the Actor of the caller.
      * @param _name name of the actor.
      * @param _typeOfActor type of account of the actor.
      * @param _country country of the actor.
      * @param _region region of the actor.
      * @param _email email of the actor.
      * @param _imageHash image hash of the profile picture saved on IPFS.
      * @param _bio short bio of the actor.
      * @dev Logs the actor updated.
      */
    function updateActor(bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string memory _imageHash, string memory _bio) public whenNotPaused {
        require(!(addressToActor[msg.sender].name == 0));
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

    /** @notice The sender gives permission to the _spender actor.
      * @param _spender address of the one to get permission.
      * @param _value bool telling if its giving permision of target.
      * @return true if it was successful.
      * @dev Logs the actor approval.
      */
    //TODO: rename function and variables
    function approve(address _spender, bool _value) public whenNotPaused returns (bool) {
        //TODO: user must have account
        //TODO: User shouldn't give permissions to itself
        allowed_[msg.sender][_spender] = _value;
        emit LogApproval(msg.sender, _spender, _value);
        return true;
    }

    /** @notice The cooperative gives permision to the _spender on behalf of the _allower.
      * @param _allower address of the one to give permission.
      * @param _spender address of the one to get permission.
      * @param _value bool telling if its giving permision of target.
      * @return true if it was successful.
      * @dev Logs the cooperative actor approval.
      */
    //TODO: rename function and variables
    function cooperativeApprove(address _allower, address _spender, bool _value) public whenNotPaused isCooperative returns (bool) {
        //TODO: user must have account
        //TODO: User shouldn't give permissions to itself
        allowed_[_allower][_spender] = _value;
        emit LogCooperativeApproval(_allower, _spender, _value, msg.sender);
        return true;
    }

    /** 
     * @notice destroy the contract and send any ether to the owner.
     */
    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
