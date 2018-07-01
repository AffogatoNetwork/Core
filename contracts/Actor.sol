pragma solidity ^0.4.23;

import "./AffogatoNetwork.sol";

contract Actor is AffogatoNetwork {

    event LogAddProcessor(uint256 indexed _id);
    event LogUpdateProcessor(uint256 indexed _id);

    struct Processor {
        address processorAddress;
        // @dev indicates the name of a Handler.
        bytes32 name;
        // @dev indicates the type of processor: Beneficio, Cooperative, Farm, Exporter, Taster
        bytes32 typeOfProcessor; 
        bytes32 department;
        bytes32 country; 
        // @dev Longitude x10^10 where the Action is done.
        int lon;
        // @dev Latitude x10^10 where the Action is done.
        int lat;   
        // @dev Additional information about the Processor, generally as a JSON object
        string additionalInformation; //story, owner, village, municipality, experience
        
    }

    mapping(address => Processor) public addressToProcessor;
    address[] public processorIds;

    function getCount() public view returns(uint count) {
        return processorIds.length;
    }

    function addProcessor(
        address _owner,
        bytes32 _name, 
        bytes32 _typeOfProcessor, 
        bytes32 _department, 
        bytes32 _country, 
        int _lon, 
        int _lat, 
        string _additionalInformation
    ) public {
        Processor memory processor = Processor(_owner,_name,_typeOfProcessor,_department,_country,_lon,_lat,_additionalInformation);
        addressToProcessor[_owner] = processor;
        processorIds.push(_owner);
        emit LogAddProcessor(processorIds.length - 1);
    }

    function updateProcessor(
        address _owner,
        bytes32 _name, 
        bytes32 _typeOfProcessor, 
        bytes32 _department, 
        bytes32 _country, 
        int _lon, 
        int _lat, 
        string _additionalInformation
    ) public {
        Processor memory processor = addressToProcessor[_owner];
        processor.name = _name;
        processor.typeOfProcessor = _typeOfProcessor;
        processor.department = _department;
        processor.country = _country;
        processor.lon = _lon;
        processor.lat = _lat;
        processor.additionalInformation = _additionalInformation;
        addressToProcessor[_owner] = processor;
        emit LogUpdateProcessor(processorIds.length - 1);
    }
}