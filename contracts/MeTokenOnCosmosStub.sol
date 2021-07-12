// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract MeTokenOnCosmosStub is Ownable { /* MeToken living on Cosmos*/
    IERC20 public atomContract;

    function setAtomAddress(address _atomContract) public onlyOwner{
        atomContract = IERC20(_atomContract);
    }

    // Initiated by our bridge servers at a regular time interval. access controlled
    // Users first have to run `initiateTransferToCosmos()` from ethereum
    function unlockOnCosmos(address[] memory minters, uint[] memory mintAmounts) public onlyOwner {
        for(uint i = 0 ; i < minters.length; i++){
            atomContract.transfer(address(minters[i]), mintAmounts[i]);
        }
        emit UnlockOnCosmos(keccak256(abi.encode(minters, mintAmounts)));
    }
    event UnlockOnCosmos(bytes32 digest);

    // Initiated by individual users at any time on cosmos.
    // After a waiting period, `unlockOnEthereum()` will be initiated by umee bridge servers.
    function initiateTransferToEthereum(uint256 amount, address ethereumAddress) public { // user initiates
        require(msg.sender == address(atomContract));
        require(ethereumAddress != address(0), "Can not send to 0x0 ethereum address");
        // atomsToStake += amount;
        emit InitiateTransferToEthereum(amount, ethereumAddress);
    }
    event InitiateTransferToEthereum(uint amount, address ethereumAddress);
}


