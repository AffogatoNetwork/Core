pragma solidity ^0.5.9;

/** @title Coffee Batch Factory.
  * @author Affogato
  */

import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';
import "./ActorFactory.sol";
import "./CoffeeBatchFactory.sol";

/** TODO:
  * Should be able to burn Tastings
  */

contract CupProfileFactory is Ownable, Pausable{

    /** @notice Logs when a Cup Profile is created. */
    event LogAddCupProfile(
        uint indexed _id,
        uint _coffeeBatchId,
        address _tasterAddress,
        string _profile,
        string _imageHash,
        uint16 _cuppingNote
    );

    /** @notice Logs when a Cup Profile is updated. */
    event LogUpdateCupProfile(
        uint indexed _id,
        string _profile,
        string _imageHash,
        uint16 _cuppingNote
    );

    /** @notice Logs when a CupProfile is destroyed. */
    event LogDestroyCupProfile(
        address _actorAddress,
        uint _id
    );

    /** @notice Throws if called by any account not allowed. */
    modifier isAllowed(address _farmerAddress, address _target){
        require(actor.isAllowed(_farmerAddress, msg.sender), "not authorized");
        _;
    }

    /** @notice Throws if called by any account other than a taster*/
    modifier onlyTaster(){
        require(actor.isTaster(msg.sender), "not a taster");
        _;
    }

    /** @notice Throws if called by any account other than a cup profile owner
      * @param _cupProfileId id of the cup profile
      */
    modifier onlyCupProfileOwner(uint _cupProfileId){
        require(cupProfiles[_cupProfileId].tasterAddress == msg.sender, "require sender to be the owner");
        _;
    }

    /**@dev ActorFactory contract object */
    ActorFactory actor;
    /**@dev CoffeeBatch contract object */
    CoffeeBatchFactory coffeeBatch;

    struct CupProfile {
        uint id;
        uint coffeeBatchId;
        string profile;
        string imageHash; /** @dev IPFS hash*/
        uint16 cuppingNote; /** @dev Range from 0 to 100*/
        address tasterAddress;
    }

    mapping(uint => CupProfile) public cupProfiles;
    uint cupProfilesCount = 1;

    /** @notice Constructor, sets the actor factory
      * @param _actorAddress contract address of ActorFactory
      * @param _coffeeBatchAddress contract address of CoffeeBatchFactory
      */
    constructor(address payable _actorAddress, address payable _coffeeBatchAddress) public {
        actor = ActorFactory(_actorAddress);
        coffeeBatch = CoffeeBatchFactory(_coffeeBatchAddress);
    }

    /** @notice Gets the data of the cup tasting by id.
      * @param _id uint with the id of the tasting.
      * @return the values of the tasting.
      */
    function getCupProfileById(uint _id)
        public
        view
        returns (
            uint,
            uint,
            string memory _profile,
            string memory,
            uint16,
            address
        )
    {
        CupProfile memory cupProfile = cupProfiles[_id];
        return (
            cupProfile.id,
            cupProfile.coffeeBatchId,
            cupProfile.profile,
            cupProfile.imageHash,
            cupProfile.cuppingNote,
            cupProfile.tasterAddress
        );
    }

    /** @notice creates a new tasting
      * @param _coffeeBatchId id of the coffee batch.
      * @param _profile of the coffee batch.
      * @param _imageHash of the coffee batch.
      * @param _cuppingNote of the coffee batch.
      * @dev sender must be a taster and must be allowed
      */
    function addCupProfile(
        uint _coffeeBatchId,
        string memory _profile,
        string memory _imageHash,
        uint16 _cuppingNote
    ) public whenNotPaused
        isAllowed(coffeeBatch.getCoffeeBatchOwner(_coffeeBatchId), msg.sender)
        onlyTaster
    {
        uint id = cupProfilesCount;
        CupProfile memory cupProfile = CupProfile(
            id,
            _coffeeBatchId,
            _profile,
            _imageHash,
            _cuppingNote,
            msg.sender
        );
        cupProfiles[id] = cupProfile;
        cupProfilesCount++;
        emit LogAddCupProfile(
            id,
            _coffeeBatchId,
            msg.sender,
            _profile,
            _imageHash,
            _cuppingNote
        );
    }

    /** @notice Updates a cup profile
      * @param _id of the cup profile.
      * @param _profile id of the coffee batch.
      * @param _imageHash of the coffee batch.
      * @param _cuppingNote of the coffee batch.
      * @dev sender must be a taster and must be creator
      */
    function updateCupProfileById(
        uint _id,
        string memory _profile,
        string memory _imageHash,
        uint16 _cuppingNote
    ) public whenNotPaused onlyTaster onlyCupProfileOwner(_id) {
        CupProfile storage cupProfile = cupProfiles[_id];
        cupProfile.profile = _profile;
        cupProfile.imageHash = _imageHash;
        cupProfile.cuppingNote = _cuppingNote;
        emit LogUpdateCupProfile(_id, _profile, _imageHash, _cuppingNote);
    }

    /** @notice destroys a cupProfile
      * @param _cupProfileId uint id of the cup profile.
      * @dev only owner can destroy account
      */
    function destroyCupProfile(uint _cupProfileId) public onlyCupProfileOwner(_cupProfileId) whenNotPaused {
       delete cupProfiles[_cupProfileId];
       emit LogDestroyCupProfile(msg.sender, _cupProfileId);
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
