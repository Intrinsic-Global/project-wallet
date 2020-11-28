pragma solidity ^0.7.5;

import "./AccessRestriction.sol";

contract Lockable is AccessRestriction {
		
	uint256 public creationTime = block.timestamp;
	uint256 public lockAt = block.timestamp;
	uint256 public releaseAt = block.timestamp;
	bool public locked = false;
	uint256 public lastStateChange = block.timestamp;
	
	event Locked(uint256 _lockTime);
	event UnLocked();
	
	modifier stateChange() {
		require(getLocked() == false, "Must be unlocked");
		_;
		lastStateChange = block.timestamp;
	}

	function okToUnlock() public view returns (bool ok) {
		if (block.timestamp >= releaseAt) {
			return true;
		} else {
			return false;
		}
	}

// 	function lockFor(uint256 _lockTime) public stateChange onlyBy(owner) {
// 		locked = true;
// 		lockAt = block.timestamp;
// 		releaseAt = block.timestamp + _lockTime;
// 		emit Locked(_lockTime);
// 	}

// 	function lockForMonths(uint256 _months) public stateChange {
// 		lockForDays(_months * 30);
// 	}

// 	function lockForDays(uint256 _days) public stateChange onlyBy(owner) {
// 		lockFor(_days * 24 * 60 * 60);
// 	}

	function getLocked() public returns (bool) {
		if (locked && okToUnlock()) {
			locked = false;
		}
		return locked;
	}
		
}