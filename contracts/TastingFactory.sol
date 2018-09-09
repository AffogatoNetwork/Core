pragma solidity ^0.4.23;

import "./Utils.sol";

//TODO: add more data to events
contract TastingFactory is Utils{

   event LogAddCupProfile(uint indexed _id);
   event LogUpdateCupProfile(uint indexed _id);
   event LogApproval(
    address indexed _owner,
    address indexed _taster,
    bool _value
   );

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

    mapping (address => mapping (address => bool)) private allowed_;

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
        require(allowed_[_owner][msg.sender]);
        uint uid = tastingCount;
        CupProfile memory cupProfile = CupProfile(uid,_aroma,_flavor,_acidity,_body,_aftertaste,_cuppingNote);
        tasterToCupProfiles[msg.sender].push(uid);
        coffeeBatchToCupProfiles[_coffeeBatchId].push(uid);
        cupProfiles[uid] = cupProfile;
        tastingCount++;
        emit LogAddCupProfile(uid);
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
        emit LogUpdateCupProfile(_uid);
    }

    function approve(address _spender, bool _value) public returns (bool) {
        allowed_[msg.sender][_spender] = _value;
        emit LogApproval(msg.sender, _spender, _value);
        return true;
    }
}