pragma solidity ^0.4.23;

contract Actor {

    mapping(address => bytes32) public addressToType;

    function getActorCount() public view returns(uint count);
    event LogAddActor(address indexed _id);
    event LogUpdateActor(address indexed _id);

    function getAccountType(address _owner) public view returns (bytes32) {
        return addressToType[_owner];
    }

    function setAccountType(address _owner, bytes32 _accountType) internal {
         addressToType[_owner] = _accountType;
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