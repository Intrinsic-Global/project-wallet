pragma solidity ^0.7.5;

import "./access/Lockable.sol";

// import "./DistributingTreaty.sol";
// import "./Treaty.sol";

contract TreatyIndex is Lockable {
    address[] public treatyIndex;
    string public name;

    event AddTreaty(address indexed _treatyAddress);
    event DeleteTreaty(address indexed _treatyAddress);
    event Rename(string indexed _oldName, string indexed _newName);

    constructor(string memory _name) public {
        name = _name;
    }

    function getNumTreaties() public view returns (uint256) {
        return treatyIndex.length;
    }

    function rename(string memory _name) public onlyBy(owner) {
        string memory oldName = name;
        name = _name;
        emit Rename(oldName, _name);
    }

    // Note: Anyone can add a treaty
    function addTreaty(address _treatyAddress) public {
        treatyIndex.push(_treatyAddress);
        emit AddTreaty(_treatyAddress);
    }

    function deleteTreaty(uint256 _indexToDelete) public onlyBy(owner) {
        address addressToDelete = treatyIndex[_indexToDelete];
        address addressToMove = treatyIndex[treatyIndex.length - 1];
        treatyIndex[_indexToDelete] = addressToMove;
        treatyIndex[treatyIndex.length - 1] = address(0);
        treatyIndex.pop();
        emit DeleteTreaty(addressToDelete);
    }

    function getTreatyIndex() public view returns (address[] memory) {
        return treatyIndex;
    }

    // function deployDistributingTreaty(
    //   uint256 _id,
    //   string memory _name,
    //   string memory _initialText)
    //   public
    //   returns (address)
    // {
    //     DistributingTreaty distributingTreaty = new DistributingTreaty(_id, _name, _initialText);
    //     addTreaty(address(distributingTreaty));
    //     return address(distributingTreaty);
    // }

    // function deployTreaty(
    //   uint256 _id,
    //   string memory _name,
    //   string memory _initialText)
    //   public
    //   returns (address)
    // {
    //     Treaty treaty = new Treaty(_id, _name, _initialText);
    //     addTreaty(address(treaty));
    //     return address(treaty);
    // }
}
