const MeToken = artifacts.require("MeToken");
const { print, assertBal, assertPts, assertSumsDontExceedTotal, assertPointAtomsConversions } = require("./utils")

contract("MeToken Integration Tests", async (accounts) => {

  it("owner function is working", async () => {
    let instance = await MeToken.new()
    let owner = await instance.owner()
    // console.log("accounts[0]", accounts[0])
    // console.log("OWNER      ", owner)
    // console.log("STUFF-- ", instance)
    // console.log("ADDRESS-- ", instance.address)
    assert.equal(accounts[0], owner, "contract should be owned by account 0")

    await instance.transferOwnership(accounts[1])
    let newowner = await instance.owner()
    assert.equal(accounts[1], newowner, "contract should be owned by account 1")

  })

})