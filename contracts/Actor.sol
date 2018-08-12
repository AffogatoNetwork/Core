pragma solidity ^0.4.23;

import "./AffogatoNetwork.sol";

contract Actor is AffogatoNetwork {

    event LogAddProcessor(uint256 indexed _id);
    event LogUpdateProcessor(uint256 indexed _id);
    event LogAddFarm(uint256 indexed _id);
    event LogUpdateFarm(uint256 indexed _id);

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

    struct Farm{
        bytes32 name;
        bytes32 country;
        bytes32 department;
        bytes32 village; 
        string story;
        string additionalInformation; //lat, lon
    }

    mapping(address => Processor) public addressToProcessor;
    address[] public processorIds;

    mapping(address => Farm[]) public addressToFarms;
    address[] public processorsWithFarm;

    function getCount() public view returns(uint count) {
        return processorIds.length;
    }
    

    function isAccountOwner() public view returns(
        bytes32 _name, 
        bytes32 _typeOfProcessor, 
        bytes32 _department, 
        bytes32 _country, 
        int _lon, 
        int _lat, 
        string _additionalInformation
    ){
        require(addressToProcessor[msg.sender].processorAddress != 0);
        Processor memory processor = addressToProcessor[msg.sender];
        return (
            processor.name,
            processor.typeOfProcessor,
            processor.department,
            processor.country,
            processor.lon,
            processor.lat,
            processor.additionalInformation
        );
    }

//TODO: Require isn't greater than count
    function getFarm(address _owner, uint _index) public view returns(
        bytes32, 
        bytes32, 
        bytes32, 
        bytes32, 
        string,
        string
        ){
       // require(addressToFarms[_owner][_index].name != 0);

        Farm memory farm = addressToFarms[_owner][_index];
        return(
            farm.name,
            farm.country,
            farm.department,
            farm.village,
            farm.story,
            farm.additionalInformation
        );
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
        require(addressToProcessor[_owner].processorAddress != _owner);
        Processor memory processor = Processor(_owner,_name,_typeOfProcessor,_department,_country,_lon,_lat,_additionalInformation);
        addressToProcessor[_owner] = processor;
        processorIds.push(_owner);
        emit LogAddProcessor(processorIds.length - 1);
    }
    // Loguear updates para que siempre se mantengan los datos (puede ser viendo bloques pasados)
    //TODO: refactor para hacerlo en menos lineas
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

    function addFarm(
        bytes32 _name, 
        bytes32 _country, 
        bytes32 _department, 
        bytes32 _village, 
        string _story,
        string _additionalInformation
    ) public {
        Farm memory farm = Farm(_name,_country,_department,_village,_story,_additionalInformation);
        addressToFarms[msg.sender].push(farm);
        processorsWithFarm.push(msg.sender);
        emit LogAddFarm(addressToFarms[msg.sender].length - 1);
    }

    function updateFarm(
        address _owner,
        uint _index,
        bytes32 _name, 
        bytes32 _country, 
        bytes32 _department, 
        bytes32 _village, 
        string _story,
        string _additionalInformation
    ) public {
        Farm memory farm = Farm(_name,_country,_department,_village,_story,_additionalInformation);
        addressToFarms[_owner][_index] = farm;
        emit LogUpdateFarm(_index);
    }

    
}