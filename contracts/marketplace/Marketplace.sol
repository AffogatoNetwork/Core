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
        bool _status,
        address _buyer
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
        address buyer;
        uint buyerPrice;

    }
    mapping (address => Bid[]) public farmerToBid;

    constructor(address _coffeeFactoryAddress) public {
        coffeeFactory = Coffee(_coffeeFactoryAddress);
    }


    //TODO: Only coffee batch owner should create a bid
    function createBid(string _title, string _imageHash, uint256 _initialPrice, uint256 _buyoutPrice, uint _coffeeBatchId, uint _timeLimit) 
    public{
        Bid memory bid = Bid(msg.sender, _title, _imageHash, _initialPrice, _buyoutPrice, _coffeeBatchId, _timeLimit, true, 0x0, _initialPrice);
        farmerToBid[msg.sender].push(bid);
        uint bidPosition = farmerToBid[msg.sender].length - 1;
        emit LogCreateBid(bidPosition, msg.sender, _title, _imageHash, _initialPrice, _buyoutPrice, _coffeeBatchId, _timeLimit, true, 0x0);
    }

    function getBid(address _owner, uint _bidPosition) public view returns(
        address,
        string,
        string,
        uint256,
        uint256,
        uint,
        uint,
        bool,
        address,
        uint
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
            bid.status,
            bid.buyer,
            bid.buyerPrice
        );
    }

    function placeBid(address _owner, uint _position) public payable {
       Bid storage bid = farmerToBid[_owner][_position];
       require(bid.status, "The Bid is not open");
       require(msg.value > bid.buyerPrice, "The Buyer Price MUST BE greater than the current bid value");
       require(bid.timeLimit > now, "The Bid is over!");
       bid.buyerPrice = msg.value;
       bid.buyer = msg.sender;
       //Check if the Buyer Price is greater than buyout price
       //Should close the bid
       //We got a winner
       if(msg.value >= bid.buyoutPrice){
           bid.status = false;
       }

    }
}