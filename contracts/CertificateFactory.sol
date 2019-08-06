pragma solidity ^0.5.9;

/** @title Actor Factory.
 *  @author Affogato
 */

import './ActorFactory.sol';
import './Libraries/Pausable.sol';

/** TODO:
  * Should be able to burn certificate
  * Should be able to update certificate
  * Only Certifiers should create farms
  */

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

    /** @notice Logs when a Certificate is Assigned to a CoffeeBatch. */
    event LogAssignCertificate(
        address _farmerAddress,
        address _certifierAddress,
        uint _coffeeBatchId,
        uint _certificateId
    );

    ActorFactory actor;

    struct Certificate {
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

    /** @notice Sets the actor factory
      * @param _actorAddress contract address of ActorFactory
      */
    constructor(address _actorAddress) public {
        actor = ActorFactory(_actorAddress);
    }

    /** @notice Gets the number of Farms
      * @param _certifier address of the certifier to count
      * @return returns a uint with the amount of certificates
      */
    function getCertifierCertificateCount(address _certifier) public view returns (uint) {
        return actorToCertificates[_certifier].length;
    }

    /** @notice Gets the data of the certificate by id.
      * @param _uid uint with the id of the certificate.
      * @return the values of the certificate.
      */
    function getCertificateById(uint _uid) public view returns (uint,
    bytes32,
    string memory,
    string memory,
    string memory) {
        Certificate memory certificate = certificates[_uid];
        return (
            certificate.uid,
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
        public whenNotPaused
    {
        uint uid = certificatesCount;
        Certificate memory certificate = Certificate(uid, _name, _imageHash, _description, _additionalInformation);
        actorToCertificates[msg.sender].push(uid);
        certificates[uid] = certificate;
        certificatesCount++;
        emit LogAddCertificate(uid, msg.sender, _name, _imageHash, _description, _additionalInformation);
    }

    /** @notice assigns a certificate
      * @param _farmerAddress address of the farmer.
      * @param _coffeeBatchId id of the coffee batch.
      * @param _certificateId id of the certificate.
      */
    function assignCertificate(
        address _farmerAddress,
        uint _coffeeBatchId,
        uint _certificateId
    ) public whenNotPaused {
        require(actor.isAllowed(_farmerAddress, msg.sender),"not authorized");
        coffeeBatchToCertificates[_coffeeBatchId].push(_certificateId);
        emit LogAssignCertificate(_farmerAddress, msg.sender, _coffeeBatchId, _certificateId);
    }

    /** @notice destroys contract
      * @dev Only Owner can call this method
      */
    function destroy() public onlyOwner {
        selfdestruct(owner());
    }
}
