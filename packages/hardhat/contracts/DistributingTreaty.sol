pragma solidity ^0.7.5;    
pragma abicoder v2;

import "./Treaty.sol";
import "./distribution/DistributeEmbedded.sol";

contract DistributingTreaty is Treaty, DistributeEmbedded {
    
  uint[] proposedSplit;
  address[] proposedSplitAccounts;
  
  constructor(
    uint256 _id,
    string memory _name,
    string memory _initialText
  ) 
    Treaty(_id, _name, _initialText)
    DistributeEmbedded() {
        proposedSplitAccounts.push(msg.sender);
        proposedSplitAccounts.push(address(this));
        proposedSplit.push(uint(2000));
        proposedSplit.push(uint(8000));
  }

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

  function isProposedSplitAccounts(address[] memory _splitAccounts) internal view returns (bool) {
    if(proposedSplitAccounts.length == 0) {
        return false;
    }
    bool result = true;
    for(uint i=0; i<_splitAccounts.length; i++) {
        if(_splitAccounts[i] != proposedSplitAccounts[i]){
            result = false;
        }
    }
    return result;
  }
  
  /**
   @notice Accept a proposed split or propose a new split. Once a identical hash and split has been signed by every account on the signature list, the split becomes active.
   */
  function signHashWithSplit(bytes32 _hash, address[] memory _splitAccounts, uint256[] memory _split) public inState(States.Active) stateChange() returns (bool) {
    if(!isProposedSplitAccounts(_splitAccounts)) {
      resetSignatures();
      delete proposedSplit;
      delete proposedSplitAccounts;   
      for(uint i = 0; i < _splitAccounts.length; i++) {
        proposedSplitAccounts.push(_splitAccounts[i]);
      }
    }

    validSplit(_splitAccounts, _split);
   
    if(!isProposedSplit(_split)) {
      resetSignatures();
      proposedSplit = _split;
    }
     
    bool allSignersApproved = super.signHash(_hash);
    if(allSignersApproved) {
        setSplit(proposedSplitAccounts, proposedSplit);
    }
    return allSignersApproved;
  }

  function getProposedSplitAccounts() public view returns (address[] memory ) {
    return proposedSplitAccounts;
  }
  
  function getProposedSplit() public view returns (uint[] memory ) {
    return proposedSplit;
  }
}
