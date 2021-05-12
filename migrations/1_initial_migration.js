const Migrations = artifacts.require("Migrations");
const MeToken = artifacts.require("MeToken");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MeToken); //just use .new() for 1-off test instances
};
