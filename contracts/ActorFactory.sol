pragma solidity 0.5.0;

import './Libraries/Pausable.sol';

//TODO: use Id instead of address
contract ActorFactory is Ownable, Pausable {
    event LogAddActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string _imageHash, string _bio);

    event LogCooperativeAddActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string _imageHash, string _bio, address _cooperativeAddress);

    event LogUpdateActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email,string _imageHash, string _bio);

    event LogApproval(address indexed _owner, address indexed _allowed, bool _value);

    event LogCooperativeApproval(address indexed _owner, address indexed _allowed, bool _value, address _cooperativeAddress);

    /**
     * @dev Throws if called by any account other than a cooperative.
     */
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

    function getActorCount() public view returns (uint count) {
        return actorsIds.length;
    }

    function getAccountType(address _owner) public view returns (bytes32) {
        return addressToActor[_owner].typeOfActor;
    }

    function isAllowed(address _owner, address _target) public view returns (bool) {
        return allowed_[_owner][_target];
    }

    function returnOwner() public view returns (bytes32, bytes32, bytes32, bytes32, bytes32, string memory, string memory) {
        Actor memory actor = addressToActor[msg.sender];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email, actor.imageHash, actor.bio);
    }

    function getActor(address _actorAddress) public view returns (bytes32, bytes32, bytes32, bytes32, bytes32,string memory,string memory) {
        Actor memory actor = addressToActor[_actorAddress];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email, actor.imageHash, actor.bio);
    }

    function addActor(bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string memory _imageHash, string memory _bio) public whenNotPaused {
        require(addressToActor[msg.sender].name == 0);
        Actor memory actor = Actor(_name, _typeOfActor, _country, _region, _email, _imageHash, _bio);
        addressToActor[msg.sender] = actor;
        actorsIds.push(msg.sender);
        emit LogAddActor(msg.sender, _name, _typeOfActor, _country, _region, _email,_imageHash, _bio);
    }

    function cooperativeAddActor(bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email, string memory _imageHash, string memory _bio, address _owner) public whenNotPaused isCooperative {
        require(addressToActor[_owner].name == 0);
        Actor memory actor = Actor(_name, _typeOfActor, _country, _region, _email, _imageHash, _bio);
        addressToActor[_owner] = actor;
        actorsIds.push(_owner);
        allowed_[_owner][msg.sender] = true;
        emit LogCooperativeAddActor(_owner, _name, _typeOfActor, _country, _region, _email,_imageHash, _bio, msg.sender);
        emit LogApproval(_owner, msg.sender, true);
    }

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

    function approve(address _spender, bool _value) public whenNotPaused returns (bool) {
        //TODO: user must have account
        //TODO: User shouldn't give permissions to itself
        allowed_[msg.sender][_spender] = _value;
        emit LogApproval(msg.sender, _spender, _value);
        return true;
    }

    function cooperativeApprove(address allower, address _spender, bool _value) public whenNotPaused isCooperative returns (bool) {
        //TODO: user must have account
        //TODO: User shouldn't give permissions to itself
        allowed_[allower][_spender] = _value;
        emit LogCooperativeApproval(allower, _spender, _value, msg.sender);
        return true;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
