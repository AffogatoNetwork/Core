pragma solidity ^0.4.23;

contract AffogatoNetwork{
    //Sell Coffee Batch
    // Util Function
    function isEmpty(string _empty) internal pure returns (bool){
        bytes memory tempEmptyString = bytes(_empty); // Uses memory
        if (tempEmptyString.length == 0) {
            return true;
        } else {
            return false;
        }
    }
}