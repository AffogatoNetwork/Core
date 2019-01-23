pragma solidity 0.5.0;

import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import './Libraries/Pausable.sol';

//TODO: use Id instead of address
contract ActorFactory is Ownable, Pausable {
    event LogAddActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email);

    event LogUpdateActor(address indexed _id, bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email);

    event LogApproval(address indexed _owner, address indexed _allowed, bool _value);

    struct Actor {
        bytes32 name;
        bytes32 typeOfActor;
        bytes32 country;
        bytes32 region;
        bytes32 email;
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

    function returnOwner() public view returns (bytes32, bytes32, bytes32, bytes32, bytes32) {
        Actor memory actor = addressToActor[msg.sender];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email);
    }

    function getActor(address _actorAddress) public view returns (bytes32, bytes32, bytes32, bytes32, bytes32) {
        Actor memory actor = addressToActor[_actorAddress];
        return (actor.name, actor.typeOfActor, actor.country, actor.region, actor.email);
    }

    function addActor(bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email) public whenNotPaused {
        require(addressToActor[msg.sender].name == 0);
        Actor memory actor = Actor(_name, _typeOfActor, _country, _region, _email);
        addressToActor[msg.sender] = actor;
        actorsIds.push(msg.sender);
        emit LogAddActor(msg.sender, _name, _typeOfActor, _country, _region, _email);
    }

    function updateActor(bytes32 _name, bytes32 _typeOfActor, bytes32 _country, bytes32 _region, bytes32 _email) public whenNotPaused {
        require(!(addressToActor[msg.sender].name == 0));
        Actor memory actor = addressToActor[msg.sender];
        actor.name = _name;
        actor.typeOfActor = _typeOfActor;
        actor.country = _country;
        actor.region = _region;
        actor.email = _email;
        addressToActor[msg.sender] = actor;
        emit LogUpdateActor(msg.sender, _name, _typeOfActor, _country, _region, _email);
    }

    function approve(address _spender, bool _value) public whenNotPaused returns (bool) {
        //TODO: user must have account
        //TODO: User shouldn't give permissions to itself
        allowed_[msg.sender][_spender] = _value;
        emit LogApproval(msg.sender, _spender, _value);
        return true;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
