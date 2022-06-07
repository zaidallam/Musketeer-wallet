// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./QuadSigWallet.sol";

contract Musketeer {
    mapping(address => QuadSigWallet[]) public wallets;

    event WalletCreated(address creator, address wallet);

    function createWallet(address member1, address member2, address member3) public {
        require(member1 != address(0));
        require(member2 != address(0));
        require(member3 != address(0));
        
        QuadSigWallet wallet = new QuadSigWallet(member1, member2, member3);
        wallets[msg.sender].push(wallet);
        wallets[member1].push(wallet);
        wallets[member2].push(wallet);
        wallets[member3].push(wallet);

        emit WalletCreated(msg.sender, address(wallet));
    }
}
