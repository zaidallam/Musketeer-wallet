const QuadSigWallet = artifacts.require("./QuadSigWallet.sol");

contract('QuadSigWallet', (accounts) => {
    const ownerAddress = accounts[0];
    const firstMemberAddress = accounts[1];

    it('fail to delete transaction on an invalid transaction ID', async () => {
        try {
            const instance = await QuadSigWallet.deployed()
            await instance.deleteTransaction(1);
            assert.fail();
        } catch (e) {
            assert.notEqual(e.message, "assert.fail()");
        }
    });

    it('fail if the creator of a pending transaction tries to sign it', async () => {
        try {
            const instance = await QuadSigWallet.deployed();
            await instance.sendTransaction({ from: ownerAddress, value: 1000 });
            await instance.withdraw(100);
            await instance.signTransaction(0);
            assert.fail();
        } catch (e) {
            assert.notEqual(e.message, "assert.fail()");
        }
    });

    it('fail if the signer of a pending transaction tries to double sign', async () => {
        try {
            const instance = await QuadSigWallet.deployed();
            await instance.sendTransaction({ from: ownerAddress, value: 1000 });
            await instance.addOwner(firstMemberAddress);
            await instance.withdraw(100, { from: firstMemberAddress });
            await instance.signTransaction(1);
            await instance.signTransaction(1);
            assert.fail();
        } catch (e) {
            assert.notEqual(e.message, "assert.fail()");
        }
    });

    // More tests would be needed in a real deployment scenario, but not necessary for my purposes
});