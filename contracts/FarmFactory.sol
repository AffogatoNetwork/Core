pragma solidity ^0.4.23;

import "./Utils.sol";

//TODO: Validate that values aren't empty
//TODO: return farmer address on add
contract FarmFactory is Utils{
    
    event LogAddFarm(
        uint indexed _id,
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village, 
        string _story
    );

    event LogUpdateFarm(
        uint indexed _id,
        address _ownerAddress,
        bytes32 _name,
        bytes32 _country,
        bytes32 _region,
        bytes32 _village, 
        string _story
    );
    
    //Farms
    struct Farm{
        uint uid;
        bytes32 name;
        bytes32 country;
        bytes32 region;
        bytes32 village; 
        string story;
    }

    mapping(address => uint[]) public farmerToFarms;
    mapping(uint => Farm) public farms;
    uint farmsCount = 1;

    function getFarmersFarmsCount(address _farmer)public view returns (uint){
        return farmerToFarms[_farmer].length;
    }

    function getFarmById(uint uid) public view returns(
        uint,
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
        bytes32 _region, 
        bytes32 _village, 
        string _story
    ) public {
        uint uid = farmsCount;
        Farm memory farm = Farm(uid,_name,_country,_region,_village,_story);
        farmerToFarms[msg.sender].push(uid);
        farms[uid] = farm;
        farmsCount++;
        emit LogAddFarm(uid,msg.sender,_name,_country,_region,_village,_story);
    }
    //TODO: only owner should update
    function updateFarm(
        uint _uid,
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
        emit LogUpdateFarm(_uid, msg.sender, _name, _country, _region, _village, _story);
    }
}
