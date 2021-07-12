const AtomStub = artifacts.require("AtomStub");
const MeToken = artifacts.require("MeToken");
const MeTokenOnCosmosStub = artifacts.require("MeTokenOnCosmosStub");
const MeTokenTest = artifacts.require("MeTokenTest");
// const { print, assertBal, assertPts, assertSumsDontExceedTotal, assertPointAtomsConversions } = require("./utils")

contract("MeToken Integration Tests", async (accounts) => {

  it("owner function is working", async () => {
    let instance = await MeToken.new()
    let owner = await instance.owner()
    assert.equal(accounts[0], owner, "contract should be owned by account 0")

    await instance.transferOwnership(accounts[1])
    let newowner = await instance.owner()
    assert.equal(accounts[1], newowner, "contract should be owned by account 1")
  })

  it("", async () => {
    var MT = await MeToken.new()
    var MTT = await MeTokenTest.new()
    var MTOCS = await MeTokenOnCosmosStub.new()
    // var watcher = MTOCS.InitiateTransferToEthereum()
    // console.log("MTOCS.address ", MTOCS.address)
    var AS = await AtomStub.new(MTOCS.address)
    await MTOCS.setAtomAddress(AS.address)
    await AS.transfer('0x1234567890123456789012345678901234567890', '0x12')
    await AS.transfer(MTOCS.address, '0x01')

    // var events = await watcher.get()
    // console.log("EVENTS ",events);  

    var ts = await AS.totalSupply()
    var bal0 = await AS.balanceOf(accounts[0])
    var bal1 = await AS.balanceOf(accounts[1]) //AtomStub is deployed and balance went to account[0]
    // console.log(ts.toString())
    // console.log(bal0.toString())
    // console.log(bal1.toString())

    //take atomStub Tokens, transfer them to MeTokenOnCosmosStub contract (probably should be a proxy)
    //this should trigger a callback in MeTokenOnCosmosStub contract that (actually we can just use a server 
    //for this so the cosmos guys dont have to figure it out) calculates points/atoms and emits an 
    //initiateTransferToEthereum event. (the MVP will assume metokens can not be transfered on cosmos)
  })

})