// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuadSigWallet {
    address private owner = msg.sender;
    mapping(address => bool) private members;
    uint256 private transactionIndex;

    uint256 constant signatureRequirement = 2;

    struct Transaction {
        uint256 value;
        address from;
        address to;
        uint8 signatureCount;
        mapping(address => bool) signatures;
    }

    mapping(uint256 => Transaction) private transactions;
    uint256[] private pendingTransactions;

    modifier isMember() {
        require(msg.sender == owner || members[msg.sender]);
        _;
    }

    constructor(
        address member1,
        address member2,
        address member3
    ) {
        members[member1] = true;
        members[member2] = true;
        members[member3] = true;
    }

    event Deposit(uint256 value, address from);
    event TransactionCreated(
        uint256 value,
        address from,
        address to,
        uint256 transactionId
    );
    event TransactionSigned(address signer, uint256 transactionId);
    event TransactionCompleted(
        uint256 value,
        address from,
        address to,
        uint256 transactionId
    );

    receive() external payable {
        emit Deposit(msg.value, msg.sender);
    }

    function withdraw(uint256 value) public {
        transfer(msg.sender, value);
    }

    function transfer(address to, uint256 value) public isMember {
        require(address(this).balance >= value);
        uint256 transactionId = transactionIndex++;

        Transaction storage transaction = transactions[transactionId];
        transaction.value = value;
        transaction.from = msg.sender;
        transaction.to = to;
        transaction.signatureCount = 0;

        pendingTransactions.push(transactionId);

        emit TransactionCreated(value, msg.sender, to, transactionId);
    }

    function getPendingTransactions()
        public
        view
        isMember
        returns (uint256[] memory)
    {
        return pendingTransactions;
    }

    function signTransaction(uint256 transactionId) public isMember {
        Transaction storage transaction = transactions[transactionId];

        require(transaction.from != address(0));
        require(msg.sender != transaction.from);
        require(!transaction.signatures[msg.sender]);

        transaction.signatures[msg.sender] = true;
        transaction.signatureCount++;

        emit TransactionSigned(msg.sender, transactionId);

        if (transaction.signatureCount >= signatureRequirement) {
            require(address(this).balance >= transaction.value);
            payable(transaction.to).transfer(transaction.value);
            emit TransactionCompleted(
                transaction.value,
                transaction.from,
                transaction.to,
                transactionId
            );
            deleteTransaction(transactionId);
        }
    }

    function deleteTransaction(uint256 transactionId) public isMember {
        bool replace = false;
        for (uint256 i = 0; i < pendingTransactions.length; i++) {
            if (replace) {
                pendingTransactions[i - 1] = pendingTransactions[i];
            } else if (transactionId == pendingTransactions[i]) {
                replace = true;
            }
        }
        pendingTransactions.pop();
        delete transactions[transactionId];
    }

    function walletBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
