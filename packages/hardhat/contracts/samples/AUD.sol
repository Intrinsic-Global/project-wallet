pragma solidity ^0.7.5;

import "../lib/@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// Sample ERC20 for testing

contract AUD is ERC20 {

    constructor() ERC20("AUD", "AUD") {
    }

    function mint(address _account, uint _amount) public {
        _mint(_account, _amount);
    }

    // function _mint(address account, uint256 amount) internal override {
    //     require(account != address(0), "ERC20: mint to the zero address");

    //     _beforeTokenTransfer(address(0), account, amount);

    //     _totalSupply = _totalSupply.add(amount);
    //     _balances[account] = _balances[account].add(amount);
    //     emit Transfer(address(0), account, amount);
    // }

}
