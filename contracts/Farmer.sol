pragma solidity ^0.4.23;

import "./Actor.sol";

//TODO: Validate that values aren't empty
contract Farmer is Actor {

    event LogAddFarm(bytes32 indexed _id);
    event LogUpdateFarm(bytes32 indexed _id);
    
    //Farmer
    struct FarmerActor {
        bytes32 name;
        bytes32 country; 
        bytes32 region;
        bytes32 email;   
    }

    mapping(address => FarmerActor) public addressToFarmer;
    address[] public farmersIds;

    //Farms
    struct Farm{
        bytes32 uid;
        bytes32 name;
        bytes32 country;
        bytes32 region;
        bytes32 village; 
        string story;
    }

    mapping(address => bytes32[]) public farmerToFarms;
    mapping(bytes32 => Farm) public farms;
    uint farmsCount = 0;

    //Farmer Functions

    function getActorCount() public view returns(uint count){
        return farmersIds.length;
    }

    function getAccountType(address _owner) public view returns (bytes32) {
        return super.getAccountType(_owner);
    }

    function returnOwner() public view returns(
        bytes32, 
        bytes32, 
        bytes32, 
        bytes32
    ){
        FarmerActor memory farmer = addressToFarmer[msg.sender];
        return(
            farmer.name,
            farmer.country,
            farmer.region,
            farmer.email
        );
    }

     function getFarmer(address _farmer) public view returns(
        bytes32, 
        bytes32, 
        bytes32, 
        bytes32
    ) {
        FarmerActor memory farmer = addressToFarmer[_farmer];
        return(
            farmer.name,
            farmer.country,
            farmer.region,
            farmer.email
        );
    }

    function addFarmer(
        bytes32 _name, 
        bytes32 _country, 
        bytes32 _region, 
        bytes32 _email
    ) public {
        require(addressToFarmer[msg.sender].name == 0);
        require(super.getAccountType(msg.sender) == 0);
        FarmerActor memory farmer = FarmerActor(_name,_country,_region,_email);
        addressToFarmer[msg.sender] = farmer;
        farmersIds.push(msg.sender);
        super.setAccountType(msg.sender,"farmer");
        emit LogAddActor(msg.sender);
    }

     function updateFarmer(
        bytes32 _name, 
        bytes32 _country, 
        bytes32 _region,
        bytes32 _email 
    ) public {
        require(!(addressToFarmer[msg.sender].name == 0));
        FarmerActor memory farmer = addressToFarmer[msg.sender];
        farmer.name = _name;
        farmer.country = _country;
        farmer.region = _region;
        farmer.email = _email;
        addressToFarmer[msg.sender] = farmer;
        emit LogUpdateActor(msg.sender);
    }

    //Farm Functions

    function getFarmersFarmsCount(address _farmer)public view returns (uint){
        return farmerToFarms[_farmer].length;
    }

    function getFarmById(bytes32 uid) public view returns(
        bytes32,
        bytes32, 
        bytes32, 
        bytes32, 
        bytes32, 
        string
        ){
        Farm memory farm = farms[uid];
        return(
            farm.uid,
            farm.name,
            farm.country,
            farm.region,
            farm.village,
            farm.story
        );
    }

    function addFarm(
        bytes32 _name, 
        bytes32 _country, 
        bytes32 _department, 
        bytes32 _village, 
        string _story
    ) public {
        bytes32 uid = keccak256(toBytes(farmsCount));
        Farm memory farm = Farm(uid,_name,_country,_department,_village,_story);
        farmerToFarms[msg.sender].push(uid);
        farms[uid] = farm;
        farmsCount++;
        emit LogAddFarm(uid);
    }

    function updateFarm(
        bytes32 _uid,
        bytes32 _name, 
        bytes32 _country, 
        bytes32 _region, 
        bytes32 _village, 
        string _story
    ) public {
        require(farms[_uid].name != 0);
        Farm storage farm = farms[_uid];
        farm.name = _name;
        farm.country = _country;
        farm.region = _region;
        farm.village = _village;
        farm.story = _story;
        emit LogUpdateFarm(_uid);
    }
}
