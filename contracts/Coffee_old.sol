/*pragma solidity ^0.4.23;

contract Coffee{

    event LogAddCoffeeBatch(bytes32 indexed _id);
    event LogAddCoffeeBatchAction(bytes32 indexed _id);
    event LogAddCoffeeBatchTasting(bytes32 indexed _id);
    event LogAddCoffeeBatchCertficate(bytes32 indexed _id);
     
    struct CoffeeBatch{
        bytes32 uid;
        bytes32 farmUid;
        uint16 altitude;
        bytes32 variety;
        bytes32 process;
        //QQ - Precision two decimals 100.00
        uint32 size;
        string lastCuppingNote; 
        bool isSold;
        mapping(bytes32 => Action) actions;
        bytes32[] actionIds;
        mapping(address => CupProfile) cupProfiles;
        address[] tasters;
        Certificate[] certificates;
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

    struct CupProfile{
        bytes32 aroma;
        bytes32 flavor;
        bytes32 acidity;
        bytes32 body;
        bytes32 aftertaste;
        string cuppingNote;
        string additionalInformation;
        uint timestamp;
    }

    struct Certificate{
        address certifier;
        bytes32 typeOfCertificate; 
        string additionalInformation;
        // @dev Instant of time when the Action is done.
        uint timestamp;
    }

    CoffeeBatch[] public coffeeBatches;
   // mapping(uint256 => CoffeeBatch) coffeeBatches;
   // uint256[] coffeeBatchIds;
   uint coffeeBatchCount = 0;

    function getCoffeeBatchCount() public view returns(uint count) {
        return coffeeBatches.length;
    }

    function getCoffeeBatchTastersCount(uint _id) public view returns(uint count) {
        return coffeeBatches[_id].tasters.length;
    }

    function getCoffeeBatchCertificatesCount(uint _id) public view returns(uint count) {
        return coffeeBatches[_id].certificates.length;
    }

    function getCoffeeBatchActions(uint _coffeeBatchIndex) public view returns(bytes32[]){
        CoffeeBatch memory coffeeBatch = coffeeBatches[_coffeeBatchIndex];
        return coffeeBatch.actionIds;
    }

    function getCoffeeBatchAction(uint _coffeeBatchIndex, bytes32 _typeOfaction) 
    public view returns (address,bytes32,string,uint){
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeBatchIndex];
        Action memory action = coffeeBatch.actions[_typeOfaction];
        return (
            action.processor,
            action.typeOfAction,
            action.additionalInformation,
            action.timestamp
        );
    }

    function getCoffeeBatchTasters(uint _coffeeBatchIndex) public view returns(address[]){
        CoffeeBatch memory coffeeBatch = coffeeBatches[_coffeeBatchIndex];
        return coffeeBatch.tasters;
    }

    function getCoffeeBatchCertificate(uint _coffeeBatchIndex, uint _certificateId) 
    public view returns(
        address,
        bytes32,
        string,
        uint
    ){
        CoffeeBatch memory coffeeBatch = coffeeBatches[_coffeeBatchIndex];
        Certificate memory certificate = coffeeBatch.certificates[_certificateId];
        return(
            certificate.certifier,
            certificate.typeOfCertificate,
            certificate.additionalInformation,
            certificate.timestamp
        );
    }

    function getCoffeeBatchCupProfile(uint _coffeeBatchIndex, address _taster) public view returns(
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        bytes32,
        string,
        string,
        uint
    ){
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeBatchIndex];
        CupProfile memory cupProfile = coffeeBatch.cupProfiles[_taster];
        return(
            cupProfile.aroma,
            cupProfile.flavor,
            cupProfile.acidity,
            cupProfile.body,
            cupProfile.aftertaste,
            cupProfile.cuppingNote,
            cupProfile.additionalInformation,
            cupProfile.timestamp
        );
    }

    function addCoffeeBatch(bytes32 _farmUid, uint16 _altitude, bytes32 _variety,bytes32 _process, uint32 _size, uint _timestamp) public {
     //   Action memory action = Action(msg.sender,"creation",_additionalInformation, _timestamp); 
        //Fixes memory error that doesn't allow to create memory objects in structs
        coffeeBatches.length++;
        CoffeeBatch storage coffeeBatch = coffeeBatches[coffeeBatches.length - 1];
        //Assigns values
        bytes32 uid = keccak256(toBytes(coffeeBatchCount));
        coffeeBatch.uid = uid;
        coffeeBatch.altitude = _altitude;
        coffeeBatch.variety = _variety;
        coffeeBatch.lastCuppingNote = "";
        coffeeBatch.isSold = false;
      //  coffeeBatch.actions["creation"] = action;
     //   coffeeBatch.actionIds.push("creation");
        coffeeBatchCount++;
        //logs insert
        emit LogAddCoffeeBatch(uid);        
    }

    function addCoffeeBatchAction(uint _coffeeBatchId, bytes32 _typeOfAction, string _additionalInformation, uint _timestamp) public {
        Action memory action = Action(msg.sender,_typeOfAction,_additionalInformation, _timestamp); 
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeBatchId];
        coffeeBatch.actions[_typeOfAction] = action;
        coffeeBatch.actionIds.push(_typeOfAction);
        emit LogAddCoffeeBatchAction(coffeeBatch.uid);   
    }

    function addCoffeeBatchTasting(
        uint _coffeeBatchId,
        bytes32 _aroma, 
        bytes32 _flavor, 
        bytes32 _acidity, 
        bytes32 _body, 
        bytes32 _aftertaste, 
        string _cuppingNote, 
        string _additionalInformation,
        uint _timestamp
    ) public {
        CupProfile memory cupProfile = CupProfile(
            _aroma, 
            _flavor, 
            _acidity, 
            _body, 
            _aftertaste, 
            _cuppingNote, 
            _additionalInformation,
            _timestamp
        ); 
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeBatchId];
        coffeeBatch.lastCuppingNote = _cuppingNote;
        coffeeBatch.cupProfiles[msg.sender] = cupProfile;
        coffeeBatch.tasters.push(msg.sender); 
        emit LogAddCoffeeBatchTasting(coffeeBatch.uid); 
    }

    function addCoffeeBatchCertificate(
        uint _coffeeBatchId,
        bytes32 _typeOfCertificate,
        string _additionalInformation,
        uint _timestamp
    ) public {
        Certificate memory certificate = Certificate(msg.sender, _typeOfCertificate, _additionalInformation, _timestamp);
        CoffeeBatch storage coffeeBatch = coffeeBatches[_coffeeBatchId];
        coffeeBatch.certificates.push(certificate);
        emit LogAddCoffeeBatchCertficate(coffeeBatch.uid); 
    }

    function toBytes(uint256 x)  internal pure returns (bytes b) {
        b = new bytes(32);
        for (uint i = 0; i < 32; i++) {
            b[i] = byte(uint8(x / (2**(8*(31 - i))))); 
        }
    }


    //TODO
    //Handle same action
    //Update Action
    //Finish Process
    
} */