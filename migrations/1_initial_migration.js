const MeToken = artifacts.require("MeToken");
const MeTokenTest = artifacts.require("MeTokenTest");

module.exports = function (deployer) {
  deployer.deploy(MeToken); //just use .new() for 1-off test instances
  deployer.deploy(MeTokenTest); //just use .new() for 1-off test instances
};
