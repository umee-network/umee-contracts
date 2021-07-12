// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MeToken is ERC20("MeToken", "UME"), Ownable{ /* MeToken living on Ethereum*/
  
    uint public _totalAtoms;
    uint public _totalPoints;
    mapping(address =>uint256) public _points;
    constructor(){
        _totalPoints = 10e18;
        _totalAtoms = 10e18;
    }
    function atomsToPoints(uint atoms) public view returns (uint256) { // rounds up
        return (atoms * _totalPoints + _totalAtoms - 1) / _totalAtoms;
    }
    function pointsToAtoms(uint points) public view returns (uint256) {// rounds down
        return points * _totalAtoms / _totalPoints;
    }
   function _move(
        address from,
        address to,
        uint256 amount
    )
        private
    {

        uint256 pointAmount = atomsToPoints(amount);// rounded up so the receiver gets *at least* the amount sent
        uint256 fromBalance = _points[from];
        require(fromBalance >= pointAmount, "ERC777: transfer amount exceeds balance");
        _points[from] -= pointAmount;
        _points[to] += pointAmount;

        emit Transfer(from, to, amount);
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalAtoms;
    }

    function balanceOf(address tokenHolder) public view virtual override returns (uint256) {
        return pointsToAtoms(_points[tokenHolder]);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _move(sender,recipient, amount);

        emit Transfer(sender, recipient, amount);
    }


    // Initiated by our bridge servers at a regular time interval. access controlled
    // Users first have to run `initiateTransferToEthereum()` from cosmos
    function unlockOnEthereum(uint newTotalAtoms, address[] memory minters, uint[] memory mintAmounts) public onlyOwner {
        _totalAtoms += newTotalAtoms;

        for(uint i = 0 ; i < minters.length; i++){
            _mint(minters[i], mintAmounts[i]);
        }
        emit UnlockOnEthereum(keccak256(abi.encode(newTotalAtoms, minters, mintAmounts)));
    }
    event UnlockOnEthereum(bytes32 digest);
    function _mint(address account, uint256 amount) internal virtual override {
        require(account != address(0), "ERC20: mint to the zero address");

        uint newTotalAtoms = _totalAtoms + amount;
        uint newTotalPoints = newTotalAtoms * _totalPoints / _totalAtoms;
        uint points = newTotalPoints - _totalPoints;
        _totalPoints = newTotalPoints;
        _totalAtoms = newTotalAtoms;
        _points[account] += points;
    }

    // Initiated by individual users at any time.
    // After a waiting period, `unlockOnCosmos()` will be initiated by umee bridge servers.
    function initiateTransferToCosmos(uint256 amount, bytes memory cosmosAddress) public { // user initiates
        _burn(_msgSender(), amount);
        emit InitiateTransferToCosmos(amount, cosmosAddress);
    }
    event InitiateTransferToCosmos(uint amount, bytes cosmosAddress);
    // note: may be non-standard `_burn` because it changes `totalSupply`
    function _burn(address account, uint256 amount) internal virtual override {
        require(account != address(0), "ERC20: burn from the zero address");

        uint256 fromBalance = pointsToAtoms(_points[account]);
        require(fromBalance >= amount, "ERC777: burn amount exceeds balance");
        
        uint newTotalAtoms = _totalAtoms - amount;
        uint newTotalPoints = newTotalAtoms * _totalPoints / _totalAtoms;
        uint points = _totalPoints - newTotalPoints;
        _totalPoints = newTotalPoints;
        _totalAtoms = newTotalAtoms;
        _points[account] -= points;
    }
}


