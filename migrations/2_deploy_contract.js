const constants = require('../constants');

const MultiSigWallet = artifacts.require("MultiSigWallet");

module.exports = function (deployer) {
    deployer.deploy(MultiSigWallet, constants.address1, constants.address2, constants.address3);
};
