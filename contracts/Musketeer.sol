// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./QuadSigWallet.sol";

contract Musketeer {
    mapping(address => address[]) public wallets;

    event WalletCreated(address creator, address wallet);

    function getWallets(address member) public view returns (address[] memory) {
        return wallets[member];
    }

    function createWallet(address member1, address member2, address member3) public {
        require(member1 != address(0));
        require(member2 != address(0));
        require(member3 != address(0));
        
        QuadSigWallet wallet = new QuadSigWallet(msg.sender, member1, member2, member3);
        wallets[msg.sender].push(address(wallet));
        wallets[member1].push(address(wallet));
        wallets[member2].push(address(wallet));
        wallets[member3].push(address(wallet));

        emit WalletCreated(msg.sender, address(wallet));
    }
}
