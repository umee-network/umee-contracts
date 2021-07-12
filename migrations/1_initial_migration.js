const MeToken = artifacts.require("MeToken");
const MeTokenTest = artifacts.require("MeTokenTest");
const MeTokenOnCosmosStub = artifacts.require("MeTokenOnCosmosStub");
const AtomStub = artifacts.require("AtomStub");

module.exports = async function (deployer, network) {
    let meToken = await deployer.deploy(MeToken); //just use .new() for 1-off test instances
    let meTokenOnCosmosStub = await deployer.deploy(MeTokenOnCosmosStub); //just use .new() for 1-off test instances
    let atomStub = await deployer.deploy(AtomStub, MeTokenOnCosmosStub.address); //just use .new() for 1-off test instances
    await meTokenOnCosmosStub.setAtomAddress(atomStub.address)
    
    // if (network == "kovan") {
    //   await deployer.deploy(MeToken); //just use .new() for 1-off test instances
    //   const instance = await MeToken.deployed()
    //   // await instance.transferOwnership()
    //   // await deployer.deploy(MeToken); //just use .new() for 1-off test instances
    //   // instance.address()
    //   // deployer.deploy(MeTokenTest); //just use .new() for 1-off test instances
    // } else if(network == "ropsten"){
    // } else if(network == "ganache"){
    // } else {  }
};
