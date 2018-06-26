pragma solidity ^0.4.23;

contract CupProfiling {

  //Tasters are the actors in charge of making the cup profile
  struct Taster{
    uint256 id;
    address owner;
    string tasterName;
    string companyName;
    string experience;
    string municipality;
    string department;
    string country;
  }

  struct CupProfile{
    string frangance;
    string flavor;
    string acidity;
    string body;
    string averageCuppingNote;
    string[] cuppingNotes;
    string defects;
    string grainSize;
    address[] tasters;
  }
  
  /*
  function getCupProfile(uint _index) public view 
  returns(string,string,string,string,string,string,string) {
    CupProfile memory cupProfile = coffeeBatches[_index].cupProfile;
    return (cupProfile.frangance,
              cupProfile.flavor,
              cupProfile.acidity,
              cupProfile.body,
              cupProfile.averageCuppingNote,
              cupProfile.defects,
              cupProfile.grainSize
    );
  } */
}