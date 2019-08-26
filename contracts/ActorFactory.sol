pragma solidity ^0.5.9;

/** @title Actor Factory.
 *  @author Affogato
 */

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "openzeppelin-solidity/contracts/access/Roles.sol";
import "./IActor.sol";

contract ActorFactory is Ownable, Pausable, IActor {

    /** @notice Defines the roles of the actors. */
    using Roles for Roles.Role;
    Roles.Role private _farmers;
    Roles.Role private _cooperatives;
    Roles.Role private _certifiers;
    Roles.Role private _technicians;
    Roles.Role private _tasters;
    Roles.Role private _validators;
    Roles.Role private _benefits;
    Roles.Role private _roasters;

    /** Roles Constants */
    bytes32 public constant FARMER = "FARMER";
    bytes32 public constant COOPERATIVE = "COOPERATIVE";
    bytes32 public constant CERTIFIER = "CERTIFIER";
    bytes32 public constant TECHNICIAN = "TECHNICIAN";
    bytes32 public constant TASTER = "TASTER";
    bytes32 public constant VALIDATOR = "VALIDATOR";
    bytes32 public constant BENEFIT = "BENEFIT";
    bytes32 public constant ROASTER = "ROASTER";

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

    /** @notice Throws if called by any account other than a cooperative. */
    modifier onlyCooperative(){
        require(_cooperatives.has(msg.sender), "not a cooperative");
        _;
    }

    /** @notice Throws if called by any account that doesn't exist
      * @param _actorAddress address of actor to check
      */
    modifier onlyExistingActor(address _actorAddress){
        require(_getAccountType(_actorAddress) != "", "actor doesn't exists");
        _;
    }

    /** @notice Throws if called by any account that does exist
      * @param _actorAddress address of actor to check
      */
    modifier onlyNotExistingActor(address _actorAddress){
        require(_getAccountType(_actorAddress) == "", "actor already exists");
        _;
    }

    /** @notice Mapping of permissions one account has given to other. */
    mapping(address => mapping(address => bool)) private allowed_;

    /** @notice Gets the type of the account.
      * @param _owner address of the owner.
      * @return returns a bytes32 with the type of account or empty if there is no account
      */
    function _getAccountType(address _owner) private view returns (bytes32) {
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
        }else if(_validators.has(_owner)){
            return VALIDATOR;
        }else if(_benefits.has(_owner)){
            return BENEFIT;
        }else if(_roasters.has(_owner)){
            return ROASTER;
        }
        return "";
    }

    /** @notice Gets the type of the account.
      * @param _owner address of the owner.
      * @return returns a bytes32 with the type of account or empty if there is no account
      */
    function getAccountType(address _owner) external view returns (bytes32) {
        return (_getAccountType(_owner));
    }

    /** @notice Gets the type of the sender account.
      * @return returns a bytes32 with the type of account or empty if there is no account
      */
    function getSenderRole() external view returns (bytes32) {
        return _getAccountType(msg.sender);
    }

    /** @notice Checks if a user has permission from another user.
      * @param _allower address of the allower.
      * @param _allowed address of the actor to check if has permission.
      * @return returns a boolean if it has permission.
      */
    function isAllowed(address _allower, address _allowed) external view returns (bool) {
        return allowed_[_allower][_allowed];
    }

    /** @notice checks if an actor exists
      * @param _actorAddress address of actor to check
      * @return true if is exists false if not
      */
    function actorExists(address _actorAddress) external view returns(bool){
        if(_getAccountType(_actorAddress) != ""){
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
            _role == TASTER ||
            _role == VALIDATOR ||
            _role == BENEFIT ||
            _role == ROASTER
        ){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a farmer
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isFarmer(address _accountAddress) external view returns (bool){
        if(_farmers.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a cooperative
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isCooperative(address _accountAddress) external view returns (bool){
        if(_cooperatives.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a certifier
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isCertifier(address _accountAddress) external view returns (bool){
        if(_certifiers.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a technician
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isTechnician(address _accountAddress) external view returns (bool){
        if(_technicians.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a taster
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isTaster(address _accountAddress) external view returns (bool){
        if(_tasters.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a validator
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isValidator(address _accountAddress) external view returns (bool){
        if(_validators.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a benefit
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isBenefit(address _accountAddress) external view returns (bool){
        if(_benefits.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice checks if account is a roaster
      * @param _accountAddress address of account to check
      * @return true if is exists false if not
      */
    function isRoaster(address _accountAddress) external view returns (bool){
        if(_roasters.has(_accountAddress)){
            return true;
        }
        return false;
    }

    /** @notice creates a new actor
      * @param _actorAddress address of the actor.
      * @param _role type of account of the actor.
      */
    function _addActor(address _actorAddress, bytes32 _role) private whenNotPaused onlyNotExistingActor(_actorAddress) {
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
        } else if( _role == VALIDATOR){
            _validators.add(_actorAddress);
        } else if( _role == BENEFIT){
            _benefits.add(_actorAddress);
        } else if( _role == ROASTER){
            _roasters.add(_actorAddress);
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
    ) external whenNotPaused onlyCooperative {
        _addActor(_actorAddress, _role);
        _approve(_actorAddress,msg.sender,true);
        emit LogCooperativeApproval(_actorAddress, msg.sender, true, msg.sender);
        emit LogCooperativeAddActor(msg.sender, _actorAddress, _role);
    }

    /** @notice approves actor
      * @param _allower address of actor to assign the permission.
      * @param _allowed address of actor to assign the permission.
      * @param _value value to be set.
      * @return true if is success
      */
    function _approve(address _allower, address _allowed, bool _value) private onlyExistingActor(_allower){
        allowed_[_allower][_allowed] = _value;
    }

    /** @notice approves actor
      * @param _allowed address of actor to assign the permission.
      * @param _value value to be set.
      * @return true if is success
      */
    function approve(address _allowed, bool _value) external whenNotPaused returns (bool) {
        _approve(msg.sender,_allowed,_value);
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
    function cooperativeApprove(address _allower, address _allowed, bool _value) external
        whenNotPaused onlyCooperative returns (bool)
    {
        _approve(_allower,_allowed,_value);
        emit LogCooperativeApproval(_allower, _allowed, _value, msg.sender);
        return true;
    }

    /** @notice destroys an actor
      * @param _actorAddress type of account of the actor.
      * @param _role type of account of the actor.
      */
    function _destroyActor(address _actorAddress, bytes32 _role) private whenNotPaused onlyExistingActor(msg.sender){
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
        } else if( _role == VALIDATOR){
            _validators.remove(_actorAddress);
        } else if( _role == BENEFIT){
            _benefits.remove(_actorAddress);
        } else if( _role == ROASTER){
            _roasters.remove(_actorAddress);
        }
    }

    /** @notice destroys an actor
      * @dev only actor can destroy account
      */
    function destroyActor() external whenNotPaused {
        bytes32 role = _getAccountType(msg.sender);
        _destroyActor(msg.sender,role);
        emit LogDestroyActor(msg.sender);
    }

    /** @notice destroys an actor
      * @param _actorAddress address of the actor.
      * @dev Only Cooperatives can call this method
      * @dev only actor can destroy account
      */
    function cooperativeDestroyActor(address _actorAddress) external whenNotPaused onlyCooperative {
        bytes32 role = _getAccountType(_actorAddress);
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
