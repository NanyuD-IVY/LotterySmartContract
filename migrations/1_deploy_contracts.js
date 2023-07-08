const LocalLottery = artifacts.require("LocalLottery");

module.exports = function (deployer) {
  deployer.deploy(LocalLottery);
};
