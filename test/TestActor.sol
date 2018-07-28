pragma solidity ^0.4.23;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Actor.sol";

contract TestActor {

    function execute(string signature) internal returns (bool){
        bytes4 sig = bytes4(keccak256(signature));
        address self = address(this);
        return self.call(sig);
    }

    function isOwner() public {
        Actor actor = Actor(DeployedAddresses.Actor());
        actor.isAccountOwner();
       // Assert.isFalse(actor.isAccountOwner({from:msg.sender}), "Should fail over not owner");
    } 

    function testProofOfOwnership() public {
        Assert.isFalse(execute("isOwner()"), "Should fail over not owner");
    }
}