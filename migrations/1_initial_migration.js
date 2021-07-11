const MeToken = artifacts.require("MeToken");
const MeTokenTest = artifacts.require("MeTokenTest");

module.exports = async function (deployer, network) {
  if (network == "kovan") {
    await deployer.deploy(MeToken); //just use .new() for 1-off test instances
    const instance = await MeToken.deployed()
    // await instance.transferOwnership()
    // await deployer.deploy(MeToken); //just use .new() for 1-off test instances
    // instance.address()
    // deployer.deploy(MeTokenTest); //just use .new() for 1-off test instances
  } else {
    // deployer.deploy(MeToken); //just use .new() for 1-off test instances
    // deployer.deploy(MeTokenTest); //just use .new() for 1-off test instances
  }
};
