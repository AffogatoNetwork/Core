pragma solidity ^0.4.23;

import "../Coffee.sol";

contract Marketplace{

    Coffee coffeeFactory;

    event LogCreateBid(
        uint _bidPosition,
        address _farmer,
        string _title, //TODO: make it a bytes32
        string _imageHash,
        uint256 _initialPrice,
        uint256 _buyoutPrice,
        uint _coffeeBatchId,
        uint _timeLimit, 
        bool _status
    );

    struct Bid {
        address farmer;
        string title;
        string imageHash;
        uint256 initialPrice;
        uint256 buyoutPrice;
        uint coffeeBatchId;
        uint timeLimit; 
        bool status;
    }
    mapping (address => Bid[]) public farmerToBid;

    constructor(address _coffeeFactoryAddress) public {
        coffeeFactory = Coffee(_coffeeFactoryAddress);
    }


    //TODO: Only coffee batch owner should create a bid
    function createBid(string _title, string _imageHash, uint256 _initialPrice, uint256 _buyoutPrice, uint _coffeeBatchId, uint _timeLimit) public{
        Bid memory bid = Bid(msg.sender, _title, _imageHash, _initialPrice, _buyoutPrice, _coffeeBatchId, _timeLimit, true);
        farmerToBid[msg.sender].push(bid);
        uint bidPosition = farmerToBid[msg.sender].length - 1;
        emit LogCreateBid(bidPosition, msg.sender, _title, _imageHash, _initialPrice, _buyoutPrice, _coffeeBatchId, _timeLimit, true);
    }

    function getBid(address _owner, uint _bidPosition) public view returns(
        address,
        string,
        string,
        uint256,
        uint256,
        uint,
        uint,
        bool
    ){
        Bid memory bid = farmerToBid[_owner][_bidPosition];
        return(
            bid.farmer,
            bid.title,
            bid.imageHash,
            bid.initialPrice,
            bid.buyoutPrice,
            bid.coffeeBatchId,
            bid.timeLimit,
            bid.status
        );
    }
}