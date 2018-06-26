pragma solidity ^0.4.23;

contract Coffee{

    struct CoffeeBatch{
        uint256 id;
        uint256 altitude;
        string variety;
        bytes32 averageCupping; 
        bool isSold;
        Action[] actions;
        // @dev Additional information about the Coffee Batch, generally as a JSON object
        string additionalInformation;
    }

    struct Action{
        //@dev address of the individual or the organization who realizes the action.
        address processor;
        //@dev description of the action.
        bytes32 typeOfAction; 
        string additionalInformation;
        // @dev Instant of time when the Action is done.
        uint timestamp;
    }

    mapping(uint256 => CoffeeBatch) coffeeBatches;
    address[] membersIds;

    //add coffee batch

    //Add Action
    //Update Action
    //Finish Process
    //Get Coffee Process 
    //Get Origin
    //Get Tasters
    

} 