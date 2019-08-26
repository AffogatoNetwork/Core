pragma solidity ^0.5.9;

/** @title Actor Factory.
 *  @author Affogato
 */

import "./IActor.sol";
import "./CoffeeBatchFactory.sol";
import 'openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract CertificateFactory is Ownable, Pausable {

    /** @notice Logs when a Certificate is created. */
    event LogAddCertificate(
        uint indexed _id,
        address _certifierAddress,
        bytes32 _name,
        string _imageHash,
        string _description,
        string _additionalInformation
    );

    /** @notice Logs when a Certificate is updated. */
    event LogUpdateCertificate(
        uint indexed _id,
        address _certifierAddress,
        bytes32 _name,
        string _imageHash,
        string _description,
        string _additionalInformation
    );

    /** @notice Logs when a Certificate is Assigned to a CoffeeBatch. */
    event LogAssignCertificate(
        address _actorAddress,
        address _certifierAddress,
        uint _coffeeBatchId,
        uint _certificateId
    );

    /** @notice Logs when a Certificate is Assigned to a CoffeeBatch. */
    event LogUnassignCertificate(
        address _actorAddress,
        address _certifierAddress,
        uint _coffeeBatchId,
        uint _certificateId
    );

    /** @notice Logs when a Certificate is destroyed. */
    event LogDestroyCertificate(
        address _actorAddress,
        uint _id
    );

    /** @notice Throws if called by any account not allowed.
      * @param _actorAddress address of the farmer
      * @param _target address of the certifier
      */
    modifier isAllowed(address _actorAddress, address _target){
        require(actor.isAllowed(_actorAddress, msg.sender), "not authorized");
        _;
    }

    /** @notice Throws if called by any account other than a certifier*/
    modifier onlyCertifier(){
        require(actor.isCertifier(msg.sender), "not a certifier");
        _;
    }

    /** @notice Throws if called by any account other than a certificate owner
      * @param _certificateId id of the certificate
      */
    modifier onlyCertificateOwner(uint _certificateId){
        require(certificates[_certificateId].certfierAddress == msg.sender, "require sender to be the owner");
        _;
    }

    /**@dev ActorFactory contract object */
    IActor actor;
    /**@dev CoffeeBatch contract object */
    CoffeeBatchFactory coffeeBatch;

    /**@dev Certificate struct object */
    struct Certificate {
        uint id;
        address certfierAddress;
        bytes32 name;
        string imageHash;
        string description;
        string additionalInformation;
    }

    mapping(uint => uint[]) public coffeeBatchToCertificates;
    mapping(uint => Certificate) public certificates;
    uint certificatesCount = 1;

    /** @notice Sets the actor factory
      * @param _actorAddress contract address of ActorFactory
      * @param _coffeeBatchAddress contract address of CoffeeBatchFactory
      */
    constructor(IActor _actorAddress, address payable _coffeeBatchAddress) public {
        actor = IActor(_actorAddress);
        coffeeBatch = CoffeeBatchFactory(_coffeeBatchAddress);
    }

    /** @notice Gets the number of certificates of a coffee batch.
      * @param _coffeeBatchId uint with the id of the coffeeBatch.
      * @return the values of the certificate.
      */
    function getCoffeeBatchCertificatesCount(uint _coffeeBatchId) public view returns (
      uint
    ) {
        return coffeeBatchToCertificates[_coffeeBatchId].length;
    }

    /** @notice Gets the data of the certificate by id.
      * @param _id uint with the id of the certificate.
      * @return the values of the certificate.
      */
    function getCertificateById(uint _id) public view returns (
      uint,
      address,
      bytes32,
      string memory,
      string memory,
      string memory
    ) {
        Certificate memory certificate = certificates[_id];
        return (
            certificate.id,
            certificate.certfierAddress,
            certificate.name,
            certificate.imageHash,
            certificate.description,
            certificate.additionalInformation
        );
    }

    /** @notice creates a new certificate
      * @param _name name of the certificate.
      * @param _imageHash image of the certificate.
      * @param _description description of the certificate.
      * @param _additionalInformation json string with additional data.
      */
    function addCertificate(
        bytes32 _name,
        string memory _imageHash,
        string memory _description,
        string memory _additionalInformation
    )
        public whenNotPaused onlyCertifier
    {
        uint id = certificatesCount;
        Certificate memory certificate = Certificate(id, msg.sender, _name, _imageHash, _description, _additionalInformation);
        certificates[id] = certificate;
        certificatesCount++;
        emit LogAddCertificate(id, msg.sender, _name, _imageHash, _description, _additionalInformation);
    }

    /** @notice updates a certificate
      * @param _certificateId id of the certificate.
      * @param _name name of the certificate.
      * @param _imageHash image of the certificate.
      * @param _description description of the certificate.
      * @param _additionalInformation json string with additional data.
      */
    function updateCertificate(
        uint _certificateId,
        bytes32 _name,
        string memory _imageHash,
        string memory _description,
        string memory _additionalInformation
    )
        public whenNotPaused onlyCertificateOwner(_certificateId)
    {
        Certificate storage certificate = certificates[_certificateId];
        certificate.name = _name;
        certificate.imageHash = _imageHash;
        certificate.description = _description;
        certificate.additionalInformation = _additionalInformation;
        emit LogUpdateCertificate(_certificateId, msg.sender, _name, _imageHash, _description, _additionalInformation);
    }

    /** @notice assigns a certificate
      * @param _coffeeBatchId id of the coffee batch.
      * @param _certificateId id of the certificate.
      */
    function assignCertificate(
        uint _coffeeBatchId,
        uint _certificateId
    ) public whenNotPaused onlyCertifier
      onlyCertificateOwner(_certificateId)
      isAllowed(coffeeBatch.getCoffeeBatchOwner(_coffeeBatchId), msg.sender)
    {
        coffeeBatchToCertificates[_coffeeBatchId].push(_certificateId);
        emit LogAssignCertificate(coffeeBatch.getCoffeeBatchOwner(_coffeeBatchId), msg.sender, _coffeeBatchId, _certificateId);
    }

    /** @notice unassigns a certificate
      * @param _coffeeBatchId id of the coffee batch.
      * @param _certificateId id of the certificate.
      * @dev iterates through the array and removes the element
      */
    function unassignCertificate(
        uint _coffeeBatchId,
        uint _certificateId
    ) public whenNotPaused onlyCertifier
      onlyCertificateOwner(_certificateId)
      isAllowed(coffeeBatch.getCoffeeBatchOwner(_coffeeBatchId), msg.sender)
    {
        uint index = 0;
        bool exists = false;
        for(uint i = 0; i < coffeeBatchToCertificates[_coffeeBatchId].length; i++){
            if(coffeeBatchToCertificates[_coffeeBatchId][i] == _certificateId){
                index = i;
                exists = true;
            }
        }
        if(exists){
          for (uint i = index; i < coffeeBatchToCertificates[_coffeeBatchId].length-1; i++){
            coffeeBatchToCertificates[_coffeeBatchId][i] = coffeeBatchToCertificates[_coffeeBatchId][i+1];
          }
          delete coffeeBatchToCertificates[_coffeeBatchId][coffeeBatchToCertificates[_coffeeBatchId].length-1];
          coffeeBatchToCertificates[_coffeeBatchId].length--;
        }
        emit LogUnassignCertificate(coffeeBatch.getCoffeeBatchOwner(_coffeeBatchId), msg.sender, _coffeeBatchId, _certificateId);
    }

    /** @notice destroys a certificate
      * @param _certificateId uint id of the certificate.
      * @dev only owner can destroy account
      */
    function destroyCertificate(uint _certificateId) public onlyCertificateOwner(_certificateId) whenNotPaused {
       delete certificates[_certificateId];
       emit LogDestroyCertificate(msg.sender, _certificateId);
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
