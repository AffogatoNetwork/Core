pragma solidity ^0.4.23;

import "./Actor.sol";

contract Taster is Actor{
     //Tasters
    struct TasterActor {
        bytes32 name;
        bytes32 country; 
        bytes32 region;
        bytes32 email;
        string experience;
    }

    mapping(address => TasterActor) public addressToTaster;
    address[] public tasterIds;

    function getActorCount() public view returns(uint count){
        return tasterIds.length;
    }

    function getAccountType(address _owner) public view returns (bytes32) {
        return super.getAccountType(_owner);
    }

    function addTaster(bytes32 _name, bytes32 _country, bytes32 _region, bytes32 _email, string _experience) public{
        require(addressToTaster[msg.sender].name == 0);
        require(!(super.accountExists(msg.sender)));
        TasterActor memory taster = TasterActor(_name,_country,_region,_email,_experience);
        addressToTaster[msg.sender] = taster;
        tasterIds.push(msg.sender);
        super.setAccountType(msg.sender,"taster");
        emit LogAddActor(msg.sender);
    }


}