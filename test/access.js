const MeToken = artifacts.require("MeToken");
const { print, assertBal, assertPts, assertSumsDontExceedTotal, assertPointAtomsConversions } = require("./utils")

contract("MeToken Integration Tests", async (accounts) => {

  it("owner function is working", async () => {
    var instance = await MeToken.new()
    var owner = await instance.owner()
    // console.log("accounts[0]", accounts[0])
    // console.log("OWNER      ", owner)
    assert.equal(accounts[0], owner, "contract should be owned by account 0")
  })
})