pragma solidity ^0.5.9;

interface IAffogato {
    /**
        @notice Returns true if the address passed to it belongs to a cooperative account
        @param _cooperative The address to be checked
        @return true if the address passed to the function belongs to a cooperative false otherwise
     */
    function isCooperative(address _cooperative) external view returns (bool);

    /**
        @notice Returns true if the address passed to it belongs to a farmer account
        @param _farmer The address to be checked
        @return true if the address passed to the function belongs to a farmer false otherwise
     */
    function isFarmer(address _farmer) external view returns (bool);
}
