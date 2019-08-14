pragma solidity ^0.5.9;

/** @title Actor Factory.
 *  @author Affogato
 */

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "openzeppelin-solidity/contracts/access/Roles.sol";

contract ActorFactory is Ownable, Pausable {
    // TODO: modifiers for other roles

    /** @notice Defines the roles of the actors. */
    using Roles for Roles.Role;
    Roles.Role private _farmers;
    Roles.Role private _cooperatives;
    Roles.Role private _certifiers;
    Roles.Role private _technicians;
    Roles.Role private _tasters;

    /** Roles Constants */
    bytes32 public constant FARMER = "FARMER";
    bytes32 public constant COOPERATIVE = "COOPERATIVE";
    bytes32 public constant CERTIFIER = "CERTIFIER";
    bytes32 public constant TECHNICIAN = "TECHNICIAN";
    bytes32 public constant TASTER = "TASTER";

    /** @notice Logs when an Actor is created. */
    event LogAddActor(
        address _actorAddress,
        bytes32 _role
    );

    /** @notice Logs when a cooperative creates an Actor. */
    event LogCooperativeAddActor(
        address _cooperativeAddress,
        address _actorAddress,
        bytes32 _role
    );

    /** @notice Logs when an Actor is destroyed. */
    event LogDestroyActor(
        address _actorAddress
    );

    /** @notice Logs when a cooperative destroys an Actor. */
    event LogCooperativeDestroyActor(
        address _cooperativeAddress,
        address _actorAddress
    );

    /** @notice Logs when an Actor gives permission. */
    event LogApproval(
        address indexed _owner,
        address indexed _allowed,
        bool _value
    );

    /** @notice Logs when a Cooperative approves for an Actor. */
    event LogCooperativeApproval(
        address indexed _owner,
        address indexed _allowed,
        bool _value,
        address _cooperativeAddress
    );

    /** @notice Throws if called by any account other than a farmer. */
    modifier isFarmer(){
        require(_farmers.has(msg.sender), "not a farmer");
        _;
    }

    /** @notice Throws if called by any account other than a cooperative. */
    modifier isCooperative(){
        require(_cooperatives.has(msg.sender), "not a cooperative");
        _;
    }

    /** @notice Throws if called by any account other than a taster. */
    modifier isTaster(){
        require(_tasters.has(msg.sender), "not a taster");
        _;
    }

    /** @notice Throws if called by any account other than a certifier. */
    modifier isCertifier(){
        require(_certifiers.has(msg.sender), "not a certifier");
        _;
    }

    /** @notice Throws if called by any account other than a technician. */
    modifier isTechnician(){
        require(_technicians.has(msg.sender), "not a technician");
        _;
    }

    /** @notice Mapping of permissions one account has given to other. */
    mapping(address => mapping(address => bool)) private allowed_;

    /** @notice Gets the type of the account.
      * @param _owner address of the owner.
      * @return returns a bytes32 with the type of account or empty if there is no account
      */
    function getAccountType(address _owner) public view returns (bytes32) {
        if(_farmers.has(_owner)){
            return FARMER;
        }else if(_cooperatives.has(_owner)){
            return COOPERATIVE;
        }else if(_certifiers.has(_owner)){
            return CERTIFIER;
        }else if(_technicians.has(_owner)){
            return TECHNICIAN;
        }else if(_tasters.has(_owner)){
            return TASTER;
        }
        return "";
    }

    /** @notice Checks if a user has permission from another user.
      * @param _allower address of the allower.
      * @param _allowed address of the actor to check if has permission.
      * @return returns a boolean if it has permission.
      */
    function isAllowed(address _allower, address _allowed) public view returns (bool) {
        return allowed_[_allower][_allowed];
    }

    /** @notice checks if an actor exists
      * @param _actorAddress address of actor to check
      * @return true if is exists false if not
      */
    function actorExists(address _actorAddress) public view returns(bool){
        if(
            _farmers.has(_actorAddress) ||
            _cooperatives.has(_actorAddress) ||
            _certifiers.has(_actorAddress) ||
            _technicians.has(_actorAddress) ||
            _tasters.has(_actorAddress)
        ){
            return true;
        }
        return false;
    }

    /** @notice checks if a role exists
      * @param _role bytes32 of role to check
      * @return true if is exists false if not
      */
    function isValidRole(bytes32 _role) internal pure returns(bool){
        if(
            _role == FARMER ||
            _role == COOPERATIVE ||
            _role == CERTIFIER ||
            _role == TECHNICIAN ||
            _role == TASTER
        ){
            return true;
        }
        return false;
    }

    /** @notice creates a new actor
      * @param _actorAddress address of the actor.
      * @param _role type of account of the actor.
      */
    function _addActor(address _actorAddress, bytes32 _role) private whenNotPaused {
        require(!actorExists(_actorAddress),"actor already exists");
        require(isValidRole(_role), "invalid role");
        if( _role == FARMER){
            _farmers.add(_actorAddress);
        } else if( _role == COOPERATIVE){
            _cooperatives.add(_actorAddress);
        } else if( _role == CERTIFIER){
            _certifiers.add(_actorAddress);
        } else if( _role == TECHNICIAN){
            _technicians.add(_actorAddress);
        } else if( _role == TASTER){
            _tasters.add(_actorAddress);
        }
    }

    /** @notice creates a new actor from sender
      * @param _role type of account of the actor.
      */
    function addActor(bytes32 _role) public whenNotPaused {
        _addActor(msg.sender, _role);
        emit LogAddActor(msg.sender, _role);
    }

    /** @notice Cooperative creates new actor
      * @param _role type of account of the actor.
      * @param _actorAddress address of the actor.
      * @dev Only Cooperatives can call this method
      */
    function cooperativeAddActor(
        bytes32 _role,
        address _actorAddress
    ) public whenNotPaused isCooperative {
        _addActor(_actorAddress, _role);
        cooperativeApprove(_actorAddress, msg.sender, true);
        emit LogCooperativeAddActor(msg.sender, _actorAddress, _role);
    }

    /** @notice approves actor
      * @param _allowed address of actor to assign the permission.
      * @param _value value to be set.
      * @return true if is success
      */
    function approve(address _allowed, bool _value) public whenNotPaused returns (bool) {
        allowed_[msg.sender][_allowed] = _value;
        emit LogApproval(msg.sender, _allowed, _value);
        return true;
    }

    /** @notice approves actor from cooperative
      * @param _allower address of actor to giving the permission.
      * @param _allowed address of actor to assign the permission.
      * @param _value value to be set.
      * @return true if is success
      * @dev Only Cooperatives can call this method
      */
    function cooperativeApprove(address _allower, address _allowed, bool _value) public whenNotPaused isCooperative returns (bool) {
        allowed_[_allower][_allowed] = _value;
        emit LogCooperativeApproval(_allower, _allowed, _value, msg.sender);
        return true;
    }

    /** @notice destroys an actor
      * @param _actorAddress type of account of the actor.
      * @param _role type of account of the actor.
      */
    function _destroyActor(address _actorAddress, bytes32 _role) private whenNotPaused {
        require(actorExists(_actorAddress),"actor doesn't exists");
        require(isValidRole(_role), "invalid role");
        if( _role == FARMER){
            _farmers.remove(_actorAddress);
        } else if( _role == COOPERATIVE){
            _cooperatives.remove(_actorAddress);
        } else if( _role == CERTIFIER){
            _certifiers.remove(_actorAddress);
        } else if( _role == TECHNICIAN){
            _technicians.remove(_actorAddress);
        } else if( _role == TASTER){
            _tasters.remove(_actorAddress);
        }
    }

    /** @notice destroys an actor
      * @dev only actor can destroy account
      */
    function destroyActor() public whenNotPaused {
        bytes32 role = getAccountType(msg.sender);
        _destroyActor(msg.sender,role);
        emit LogDestroyActor(msg.sender);
    }

    /** @notice destroys an actor
      * @param _actorAddress address of the actor.
      * @dev Only Cooperatives can call this method
      * @dev only actor can destroy account
      */
    function cooperativeDestroyActor(address _actorAddress) public whenNotPaused isCooperative {
        bytes32 role = getAccountType(_actorAddress);
        _destroyActor(_actorAddress,role);
        emit LogCooperativeDestroyActor(msg.sender, _actorAddress);
    }

    /** @notice destroys contract
      * @dev Only Owner can call this method
      */
    function destroy() public onlyOwner {
        address payable owner = address(uint160(owner()));
        selfdestruct(owner);
    }

    /** @notice reverts if ETH is sent */
    function() external payable{
      revert("Contract can't receive Ether");
    }
}
