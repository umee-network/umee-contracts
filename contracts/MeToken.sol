// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20//ERC20.sol";

contract MeToken is ERC20("MeToken", "UME") {
  
    uint public _totalAtoms;
    uint public _totalPoints;
    mapping(address =>uint256) public _points;
    constructor(){
        _totalPoints = 10e18;
        _totalAtoms = 10e18;
        // _totalPoints = 1;
        // _totalAtoms = 1; //use 1 for testing so we can spot potential issues with ratio mechanism
    }
    function atomsToPoints(uint atoms) public view returns (uint256) { // rounds down
        return (atoms * _totalPoints + _totalAtoms - 1) / _totalAtoms;
    }
    function pointsToAtoms(uint points) public view returns (uint256) {// rounds down
        return points * _totalAtoms / _totalPoints;
    }
    function _updateTotalAtomSupply(uint newTotal) public {
        _totalAtoms = newTotal;
    }
   function _move(
        address from,
        address to,
        uint256 amount
    )
        private
    {

        uint256 pointAmount = atomsToPoints(amount);// rounded up
        uint256 fromBalance = _points[from];
        require(fromBalance >= pointAmount, "ERC777: transfer amount exceeds balance");
        _points[from] -= pointAmount;
        _points[to] += pointAmount;

        emit Transfer(from, to, amount);
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalAtoms;
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(address tokenHolder) public view virtual override returns (uint256) {
        return pointsToAtoms(_points[tokenHolder]);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _move(sender,recipient, amount);

        emit Transfer(sender, recipient, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     */
    function mint(address account, uint256 amount) public {_mint(account, amount);}
    function _mint(address account, uint256 amount) internal virtual override {// unlock or "move" to ethereum
        require(account != address(0), "ERC20: mint to the zero address");

        // _beforeTokenTransfer(address(0), account, amount);

        uint newTotalAtoms = _totalAtoms + amount;
        uint newTotalPoints =  newTotalAtoms * _totalPoints / _totalAtoms;
        uint points = newTotalPoints - _totalPoints;
        _totalPoints = newTotalPoints;
        _totalAtoms = newTotalAtoms;
        _points[account] += points;


        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, does NOT reduce the
     * total supply!
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function burn(address account, uint256 amount) public {_burn(account, amount);}
    function _burn(address account, uint256 amount) internal virtual override {// lock or "move" back to cosmos
        require(account != address(0), "ERC20: burn from the zero address");

        // _beforeTokenTransfer(account, address(0), amount);

        uint256 fromBalance = pointsToAtoms(_points[account]);
        require(fromBalance >= amount, "ERC777: burn amount exceeds balance");
        
        uint newTotalAtoms = _totalAtoms - amount;
        uint newTotalPoints = newTotalAtoms * _totalPoints / _totalAtoms;
        uint points = _totalPoints - newTotalPoints;
        _totalPoints = newTotalPoints;
        _totalAtoms = newTotalAtoms;
        _points[account] -= points;

        emit Transfer(account, address(0), amount);
    }
}


