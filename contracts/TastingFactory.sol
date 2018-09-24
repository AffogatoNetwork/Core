pragma solidity ^0.4.23;

import "./Utils.sol";
import "./ActorFactory.sol";

contract TastingFactory is Utils{

   event LogAddCupProfile(
        uint indexed _id,
        uint _coffeeBatchId,
        bytes32 _aroma,
        bytes32 _flavor,
        bytes32 _acidity,
        bytes32 _body,
        bytes32 _aftertaste,
        uint16 _cuppingNote
    );
   event LogUpdateCupProfile(
        uint indexed _id,
        bytes32 _aroma,
        bytes32 _flavor,
        bytes32 _acidity,
        bytes32 _body,
        bytes32 _aftertaste,
        uint16 _cuppingNote
    );

   ActorFactory actor;

   struct CupProfile{
        uint uid;
        bytes32 aroma;
        bytes32 flavor;
        bytes32 acidity;
        bytes32 body;
        bytes32 aftertaste;
        //Precision two decimals 100.00
        uint16 cuppingNote;
    }

    mapping(address => uint[]) public tasterToCupProfiles;
    mapping(uint => uint[]) public coffeeBatchToCupProfiles;
    mapping(uint => CupProfile) public cupProfiles;
    uint tastingCount = 1;

    constructor(address _actorAddress) public {
        actor = ActorFactory(_actorAddress);
    }

    function getTasterCupProfileCount(address _taster)public view returns (uint){
        return tasterToCupProfiles[_taster].length;
    }

    function getCoffeeCupProfileCount(uint _coffeeBatch)public view returns (uint){
        return coffeeBatchToCupProfiles[_coffeeBatch].length;
    }

    function getCupProfileById(uint uid) public view returns(
        uint,
        bytes32, 
        bytes32, 
        bytes32, 
        bytes32,
        bytes32, 
        uint16
        ){
        CupProfile memory cupProfile = cupProfiles[uid];
        return(
            cupProfile.uid,
            cupProfile.aroma,
            cupProfile.flavor,
            cupProfile.acidity,
            cupProfile.body,
            cupProfile.aftertaste,
            cupProfile.cuppingNote
        );
    }

    function addCupProfile(
        address _owner,
        uint _coffeeBatchId,
        bytes32 _aroma,
        bytes32 _flavor,
        bytes32 _acidity,
        bytes32 _body,
        bytes32 _aftertaste,
        uint16 _cuppingNote
    ) public {
        require(actor.isAllowed(_owner,msg.sender));
        uint uid = tastingCount;
        CupProfile memory cupProfile = CupProfile(uid,_aroma,_flavor,_acidity,_body,_aftertaste,_cuppingNote);
        tasterToCupProfiles[msg.sender].push(uid);
        coffeeBatchToCupProfiles[_coffeeBatchId].push(uid);
        cupProfiles[uid] = cupProfile;
        tastingCount++;
        emit LogAddCupProfile(uid,_coffeeBatchId,_aroma,_flavor,_acidity,_body,_aftertaste,_cuppingNote);
    }
    //Coffee Batch can't be updated
    function updateCupProfileById(
        uint _uid,
        bytes32 _aroma,
        bytes32 _flavor,
        bytes32 _acidity,
        bytes32 _body,
        bytes32 _aftertaste,
        uint16 _cuppingNote
    ) public {
        require(cupProfiles[_uid].aroma != 0);
        CupProfile storage cupProfile = cupProfiles[_uid];
        cupProfile.aroma = _aroma;
        cupProfile.flavor = _flavor;
        cupProfile.acidity = _acidity;
        cupProfile.body = _body;
        cupProfile.aftertaste = _aftertaste;
        cupProfile.cuppingNote = _cuppingNote;
        emit LogUpdateCupProfile(_uid,_aroma,_flavor,_acidity,_body,_aftertaste,_cuppingNote);
    }
}