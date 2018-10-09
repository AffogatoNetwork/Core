pragma solidity ^0.4.23;

import "./Utils.sol";
import "./ActorFactory.sol";

contract CertificateFactory is Utils{

   event LogAddCertificate(
        uint indexed _id,
        address _certifierAddress,
        bytes32 _name,
        string _imageHash,
        string _description,
        string _additionalInformation
    );

   event LogAssignCertificate(
        address _ownerAddress,
        address _certifierAddress,
        uint _coffeeBatchId,
        uint _certificateId
    );

   ActorFactory actor;

   struct Certificate{
        uint uid;
        bytes32 name;
        string imageHash;
        string description;
        string additionalInformation;
   }

    mapping(address => uint[]) public actorToCertificates;
    mapping(uint => uint[]) public coffeeBatchToCertificates;
    mapping(uint => Certificate) public certificates;
    uint certificatesCount = 1;

    constructor(address _actorAddress) public {
        actor = ActorFactory(_actorAddress);
    }

    function getCertifierCertificateCount(address _certifier)public view returns (uint){
        return actorToCertificates[_certifier].length;
    }
    
    function getCertificateById(uint _certificateId) public view returns(
        uint,
        bytes32,
        string,
        string,
        string
    ){
        Certificate memory certificate = certificates[_certificateId];
        return(
            certificate.uid,
            certificate.name,
            certificate.imageHash,
            certificate.description,
            certificate.additionalInformation
        );
    }

    //TODO: Should insert if no actor?
    function addCertificate(bytes32 _name, string _imageHash, string _description, string _additionalInformation
    ) public {
        uint uid = certificatesCount;
        Certificate memory certificate = Certificate(uid, _name, _imageHash, _description, _additionalInformation);
        actorToCertificates[msg.sender].push(uid);
        certificates[uid] = certificate;
        certificatesCount++;
        emit LogAddCertificate(uid,msg.sender,_name, _imageHash, _description, _additionalInformation);
    }

    function assignCertificate(address _owner, uint _coffeeBatchId, uint _certificateId
    ) public {
        require(actor.isAllowed(_owner,msg.sender));
        coffeeBatchToCertificates[_coffeeBatchId].push(_certificateId);
        emit LogAssignCertificate(_owner, msg.sender, _coffeeBatchId, _certificateId);
    }
   
}