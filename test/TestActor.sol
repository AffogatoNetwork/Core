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
        Assert.isFalse(execute('isOwner()'), "Should fail over not owner");
    }

    function uniqueProcessor() public {
        Actor actor = Actor(DeployedAddresses.Actor());
        actor.addProcessor(address(6),0,0,0,0,0,0,"0");
        actor.addProcessor(address(6),0,0,0,0,0,0,"0");
    } 

     function processorMustExists() public {
        Actor actor = Actor(DeployedAddresses.Actor());
         actor.updateProcessor(address(6),0,0,0,0,0,0,"0");
       // Assert.isFalse(actor.isAccountOwner({from:msg.sender}), "Should fail over not owner");
    } 

    function testProcessor() public{
        Assert.isFalse(execute('uniqueProcessor()'), "Should fail over repeated proceesor");
        Assert.isFalse(execute('processorMustExists()'), "Should fail over update non existant proceesor");
    }
    function getFarmAdress() public {
        Actor actor = Actor(DeployedAddresses.Actor());
        actor.getFarm(address(0),1000000000000);
    } 

    function getFarmIndex() public {
        Actor actor = Actor(DeployedAddresses.Actor());
        actor.getFarm(address(0), 1000000000000);
    } 
    //TODO: not working try open Zepelin https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/test/helpers/expectThrow.js
    function testFarmRequirements() public {    
        //Assert.isFalse(execute('getFarmAdress()'), "Should fail over invalid address");
      //  Assert.isFalse(execute('getFarmIndex()'), 'Should fail over index overflow');
    }
}