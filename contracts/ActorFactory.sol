pragma solidity ^0.4.23;

contract ActorFactory {

    event LogAddActor(address indexed _id);
    event LogUpdateActor(address indexed _id);

     //Farmer
    struct Actor {
        bytes32 name;
        bytes32 typeOfActor; 
        bytes32 country; 
        bytes32 region;
        bytes32 email;   
    }

    mapping(address => Actor) public addressToActor;
    address[] public actorsIds;    

    function getActorCount() public view returns(uint count){
        return actorsIds.length;
    }

    function getAccountType(address _owner) public view returns(bytes32) {
        return addressToActor[_owner].typeOfActor;
    }

    function returnOwner() public view returns(
        bytes32, 
        bytes32, 
        bytes32, 
        bytes32,
        bytes32
    ){
        Actor memory actor = addressToActor[msg.sender];
        return(
            actor.name,
            actor.typeOfActor,
            actor.country,
            actor.region,
            actor.email
        );
    }

    function getActor(address _actorAddress) public view returns(
        bytes32, 
        bytes32,
        bytes32, 
        bytes32, 
        bytes32
    ) {
        Actor memory actor = addressToActor[_actorAddress];
        return(
            actor.name,
            actor.typeOfActor,
            actor.country,
            actor.region,
            actor.email
        );
    }

    function addActor(
        bytes32 _name, 
        bytes32 _typeOfActor,
        bytes32 _country, 
        bytes32 _region, 
        bytes32 _email
    ) public {
        require(addressToActor[msg.sender].name == 0);
        Actor memory actor = Actor(_name,_typeOfActor,_country,_region,_email);
        addressToActor[msg.sender] = actor;
        actorsIds.push(msg.sender);
        emit LogAddActor(msg.sender);
    }

    function updateActor(
        bytes32 _name, 
        bytes32 _typeOfActor,
        bytes32 _country, 
        bytes32 _region,
        bytes32 _email 
    ) public {
        require(!(addressToActor[msg.sender].name == 0));
        Actor memory actor = addressToActor[msg.sender];
        actor.name = _name;
        actor.typeOfActor = _typeOfActor;
        actor.country = _country;
        actor.region = _region;
        actor.email = _email;
        addressToActor[msg.sender] = actor;
        emit LogUpdateActor(msg.sender);
    }

    //Utils
    function isEmptyString(string _empty) internal pure returns (bool){
        bytes memory tempEmptyString = bytes(_empty); // Uses memory
        if (tempEmptyString.length == 0) {
            return true;
        } else {
            return false;
        }
    }

    function isEmptyBytes(bytes32 _empty) internal pure returns (bool){
        if (_empty.length == 0) {
            return true;
        } else {
            return false;
        }
    }

     function toBytes(uint256 x)  internal pure returns (bytes b) {
        b = new bytes(32);
        for (uint i = 0; i < 32; i++) {
            b[i] = byte(uint8(x / (2**(8*(31 - i))))); 
        }
    }
        
}