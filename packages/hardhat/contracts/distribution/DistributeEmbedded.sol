/*

Treaties with the Distribute plugin, can agree on a % split.

Any funds sent to the contract, for example ticket sales, will be allocated based on the agreed upon % split.

Allocated funds can then be withdrawn.

*/

pragma solidity ^0.7.5;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../lib/hardhat/console.sol";

contract DistributeEmbedded {
    using SafeMath for uint256;
    bool mutex = false;
    mapping(address => uint256) public split;
    mapping(address => mapping(address => uint256)) public tokenAllocations;
    mapping(address => uint256) public ethAllocations;
    address[] public splitAccounts;
    uint256 constant splitDecimals = 2;

    struct DistributionAccount {
        address account;
        uint split;
    }

    event SetSplit(uint256[] _split);
    event Allocated(uint256 _index, address _account, uint256 _amount);
    event AllocatedToken(
        address _tokenAddress,
        uint256 _index,
        address _account,
        uint256 _amount
    );
    event Withdraw(address _to, uint256 _amount);
    event WithdrawToken(address _token, address _to, uint256 _amount);
    event AddSplitAccount(address _account);
    event ClearSplitAccounts();
    event Received(uint256 _amount);

    modifier preventRecursion() {
        if (mutex == false) {
            mutex = true;
            _;
            mutex = false;
        }
    }

    constructor() {
        addSplitAccount(msg.sender);
        split[msg.sender] = 3300;
        addSplitAccount(address(0x93f8dddd876c7dBE3323723500e83E202A7C96CC));
        split[msg.sender] = 3300;
        addSplitAccount(address(0xcCbE7717e986CCb546E50d16143757Aff9CEd4e4));
        split[msg.sender] = 3300;
    }

    /// Add a new account for distribution of incoming funds

    function addSplitAccount(address _account) internal returns (uint256) {
        splitAccounts.push(_account);
        emit AddSplitAccount(_account);
        return splitAccounts.length;
    }

    /// Clear (remove) accounts for distribution of incoming funds

    function clearSplitAccounts() internal {
        delete splitAccounts;
        emit ClearSplitAccounts();
    }

    /// Set a new split ratio for distributing funds

    function setSplit(uint256[] memory _split) internal {
        console.log("Split set to [%s %s ...]", _split[0], _split[1]);
        validSplit(_split);
        for (uint256 i = 0; i < _split.length; i++) {
            split[splitAccounts[i]] = _split[i];
        }
        emit SetSplit(_split);
    }

    function validSplit(uint256[] memory _split) internal view {
        require(
            _split.length == splitAccounts.length,
            "Input size must match number of splitAccounts"
        );
        uint256 sum = 0;
        for (uint256 i = 0; i < _split.length; i++) {
            sum += _split[i];
        }
        require(sum == 100 * 10**splitDecimals, "Split must total 100");
    }

    /// Automatically distribute incoming funds

    receive() external payable {
        console.log("Funds received: %s", msg.value);
        emit Received(msg.value);
        if (msg.value > 0) {
            allocateSplitAccounts();
        }
    }

    function allocateSplitAccounts() internal {
        for (uint256 i = 0; i < splitAccounts.length; i++) {
            uint256 thisAllocation = (msg.value * split[splitAccounts[i]]) /
                (100 * 10**splitDecimals);
            ethAllocations[splitAccounts[i]] += thisAllocation;
            console.log(
                "%s. Allocated %s to %s",
                i,
                thisAllocation,
                splitAccounts[i]
            );
            emit Allocated(i, splitAccounts[i], thisAllocation);
        }
    }

    /// Simulate how incoming funds would be distributed

    // function simulateDeposit(uint _value) public {
    //     for(uint i=0; i<splitAccounts.length; i++) {
    //         uint thisAllocation = _value * split[splitAccounts[i]] / 100 * 10 ** splitDecimals;
    //         emit Allocated(i, splitAccounts[i], thisAllocation);
    //     }
    // }

    /// Withdraw ether or token balance

    function withdraw(uint256 _amount)
        public
        preventRecursion
        returns (uint256)
    {
        require(ethAllocations[msg.sender] >= _amount, "Insufficient balance");
        console.log("Processing withdraw of %s", _amount);
        console.log("Original balance %s", ethAllocations[msg.sender]);
        msg.sender.transfer(_amount);
        ethAllocations[msg.sender] -= _amount;
        emit Withdraw(msg.sender, _amount);
        console.log(
            "Success. Remaining balance %s",
            ethAllocations[msg.sender]
        );
        return ethAllocations[msg.sender]; // Return remaining balance
    }

    function withdrawMax() public preventRecursion returns (uint256) {
        uint256 max = ethAllocations[msg.sender];
        console.log("Processing withdraw of %s", max);
        msg.sender.transfer(max);
        ethAllocations[msg.sender] -= max;
        emit Withdraw(msg.sender, max);
        console.log("Success");
        return ethAllocations[msg.sender]; // Return remaining balance
    }

    function withdrawToken(address _tokenAddress, uint256 _amount)
        public
        preventRecursion
        returns (uint256)
    {
        require(
            tokenAllocations[_tokenAddress][msg.sender] >= _amount,
            "Insufficient balance"
        );
        IERC20(_tokenAddress).transfer(msg.sender, _amount);
        tokenAllocations[_tokenAddress][msg.sender] -= _amount;
        emit WithdrawToken(_tokenAddress, msg.sender, _amount);
        return tokenAllocations[_tokenAddress][msg.sender]; // Return remaining balance
    }

    /// Check sender balance

    function checkBalance() public view returns (uint256) {
        return ethAllocations[msg.sender];
    }

    function checkTokenBalance(address _tokenAddress)
        public
        view
        returns (uint256)
    {
        return tokenAllocations[_tokenAddress][msg.sender];
    }

    /// Manual ERC20 distribution for tokens that do not support ERC777

    function manualERC20Distribution(address _tokenAddress)
        public
        returns (uint256)
    {
        for (uint256 i = 0; i < splitAccounts.length; i++) {
            uint256 thisAllocation = ((IERC20(_tokenAddress).balanceOf(
                address(this)
            ) * split[splitAccounts[i]]) / 100) * 10**splitDecimals;
            tokenAllocations[_tokenAddress][splitAccounts[i]] += thisAllocation;
            emit AllocatedToken(
                _tokenAddress,
                i,
                splitAccounts[i],
                thisAllocation
            );
        }
    }

    /// Balances held by this contract:

    function getHeldBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getHeldTokenBalance(address _tokenAddress)
        public
        view
        returns (uint256)
    {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    /// Getters

    function getSplitAccounts() public view returns (address[10] memory) {
        address[10] memory mSplitAccounts;
        for(uint i=0; i<splitAccounts.length;i++){
            mSplitAccounts[i] = splitAccounts[i];
        }      
        return mSplitAccounts;
    }

    function getSplits() public view returns (uint[10] memory) {
        uint[10] memory splits;
        for(uint i=0; i<splitAccounts.length;i++){
            splits[i] = split[splitAccounts[i]];
        }
        return splits;
    }
    
    /// Getter convenience functions

    // function getSplit(uint _index) public view returns (uint256) {
    //     return split[splitAccounts[_index]];
    // }
}
