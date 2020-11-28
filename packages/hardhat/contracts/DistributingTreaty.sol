pragma solidity ^0.7.5;    


import "./Treaty.sol";
import "./distribution/DistributeEmbedded.sol";

contract DistributingTreaty is Treaty, DistributeEmbedded {
    
  /// Split agreements ///
  uint[] public proposedSplit;

  constructor(
    uint256 _id,
    string memory _name,
    string memory _initialText
  ) 
    Treaty(_id, _name, _initialText)
    DistributeEmbedded() {
    id = _id;
    name = _name;
    unsignedTreatyText.push(_initialText);
    lawyerAddress = msg.sender;
  }

//   constructor() 
//     Treaty(1, 'Name', 'Initial text')
//     DistributeEmbedded() {
//     id = 1;
//     name = 'Name';
//     lawyerAddress = msg.sender;
//   }

  function registerAsSigner() public inState(States.Draft) stateChange() override {
    super.registerAsSigner();
  }

  function signTreaty() public inState(States.Active) stateChange() override returns (bool) {
    super.signTreaty();
    delete proposedSplit;
  }

  function signHash(bytes32 _hash) public inState(States.Active) stateChange() override returns (bool) {
    super.signHash(_hash);
    delete proposedSplit;
  }  
  
  function isProposedSplit(uint256[] memory _split) internal view returns (bool) {
    if(proposedSplit.length == 0) {
        return false;
    }
    bool result = true;
    for(uint i=0; i<_split.length; i++) {
        if(_split[i] != proposedSplit[i]){
            result = false;
        }
    }
    return result;
  }
  
  function isSplitAccounts(address[] memory _splitAccounts) internal view returns (bool) {
    if(splitAccounts.length == 0) {
        return false;
    }
    bool result = true;
    for(uint i=0; i<_splitAccounts.length; i++) {
        if(_splitAccounts[i] != splitAccounts[i]){
            result = false;
        }
    }
    return result;
  }
  
  function signHashWithSplit(bytes32 _hash, address[] memory _splitAccounts, uint256[] memory _split) public inState(States.Active) stateChange() returns (bool) {
    //require(_split.length == signatureList.length, "One split value required per signer");
    
    if(!isSplitAccounts(_splitAccounts)) {
      resetSignatures();
      clearSplitAccounts();
      for(uint i = 0; i < _splitAccounts.length; i++) {
        addSplitAccount(_splitAccounts[i]);
      }
    }

    validSplit(_split);
   
    if(!isProposedSplit(_split)) {
      resetSignatures();
      proposedSplit = _split;
    }
     
    bool allSignersApproved = super.signHash(_hash);
    if(allSignersApproved) {
        setSplit(proposedSplit);
    }
    return allSignersApproved;
  }

}
