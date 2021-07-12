// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MeTokenOnCosmosStub.sol";

contract AtomStub is ERC20("AtomStub", "ATOM") {
    MeTokenOnCosmosStub meTokenOnCosmosStub;
    constructor(address _meTokenOnCosmosStub){
      meTokenOnCosmosStub = MeTokenOnCosmosStub(_meTokenOnCosmosStub);
        _mint(msg.sender, 1 * 10e18);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual override{
        super._transfer(sender, recipient, amount);
        if(recipient == address(meTokenOnCosmosStub)){
            meTokenOnCosmosStub.initiateTransferToEthereum(amount, _msgSender());
        }
    }

}
