const MeToken = artifacts.require("MeToken");

module.exports = function (deployer) {
  deployer.deploy(MeToken); //just use .new() for 1-off test instances
};
