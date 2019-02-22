pragma solidity ^0.5.0;

import './Libraries/Pausable.sol';

//TODO: Validate that values aren't empty
//TODO: Shoukd had owner address
contract FarmFactory  is Ownable, Pausable {
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

    function getFarmersFarmsCount(address _farmer) public view returns (uint) {
        return farmerToFarms[_farmer].length;
    }

    function getFarmById(uint uid) public view returns (uint, bytes32, bytes32, bytes32, bytes32, string memory, address) {
        Farm memory farm = farms[uid];
        return (farm.uid, farm.name, farm.country, farm.region, farm.village, farm.story, farm.ownerAddress);
    }

    function addFarm(bytes32 _name, bytes32 _country, bytes32 _region, bytes32 _village, string memory _story) public whenNotPaused {
        uint uid = farmsCount;
        Farm memory farm = Farm(uid, msg.sender, _name, _country, _region, _village, _story);
        farmerToFarms[msg.sender].push(uid);
        farms[uid] = farm;
        farmsCount++;
        emit LogAddFarm(uid, msg.sender, _name, _country, _region, _village, _story);
    }
    function updateFarm(uint _uid, bytes32 _name, bytes32 _country, bytes32 _region, bytes32 _village, string memory _story) public whenNotPaused {
        require(farms[_uid].name != 0);
        require(farms[_uid].ownerAddress == msg.sender);
        Farm storage farm = farms[_uid];
        farm.name = _name;
        farm.country = _country;
        farm.region = _region;
        farm.village = _village;
        farm.story = _story;
        emit LogUpdateFarm(_uid, farm.ownerAddress, _name, _country, _region, _village, _story);
    }

    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
