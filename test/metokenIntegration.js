const MeToken = artifacts.require("MeTokenTest");
const { print, assertBal, assertPts, assertSumsDontExceedTotal, assertPointAtomsConversions } = require("./utils")

//to test:
// make sure going from asking `balanceOf()` and then `transfer` using that reported balance 
// (a) always has enough points for the transfer
// (b) always results in the receiver having *at least* that many atoms (and hopefully )
// (c) (this may be the case but might not be possible) *if* receiver already have a balance, 
// their new balance is *at least* the sum of theirs before and after. logically I think it makes sense because
// both people will see rounded down atoms amount when querying their own balance, and since 

contract("MeToken Integration Tests", async (accounts) => {

  it("mint() and burn() should properly affect all balances", async () => {
    instance = await MeToken.new()
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)

    await instance.mint(accounts[0], 2)
    await instance.mint(accounts[1], 7)
    await instance.mint(accounts[2], 23)
    await instance.mint(accounts[3], 23)
    await instance.mint(accounts[4], 24)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)
    await instance.burn(accounts[3], 3)
    await instance.burn(accounts[4], 8)
    await instance.burn(accounts[2], 1)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)    
    await assertSumsDontExceedTotal(instance, accounts)    
    assertBal(instance, accounts[3], 23 - 3)
    assertBal(instance, accounts[4], 24 - 8)
    assertBal(instance, accounts[2], 23 - 1)
    
    await instance.mint(accounts[0], 2)
    await instance.mint(accounts[1], 57)
    // await print(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)
    assertBal(instance, accounts[3], 23 - 3)
    assertBal(instance, accounts[4], 24 - 8)
    assertBal(instance, accounts[2], 23 - 1)

    assertBal(instance, accounts[0], 2 + 2)
    assertBal(instance, accounts[1], 7 + 57)
  })

  it("updateTotalAtomSupply() should properly affect all balances", async () => {
    instance = await MeToken.new()
    await assertPointAtomsConversions(instance, accounts)
    await instance.mint(accounts[0], 2)
    await instance.mint(accounts[1], 7)
    await instance.mint(accounts[2], 23)
    await instance.mint(accounts[3], 23)
    await instance.mint(accounts[4], 24)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    await instance.burn(accounts[3], 3)
    await instance.burn(accounts[4], 8)
    await instance.burn(accounts[2], 1)
    // await print(instance, accounts)
    
    assertBal(instance, accounts[3], 23 - 3)
    assertBal(instance, accounts[4], 24 - 8)
    assertBal(instance, accounts[2], 23 - 1)
    await assertSumsDontExceedTotal(instance, accounts)
    
    await instance.mint(accounts[0], 2)
    await instance.mint(accounts[1], 57)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    assertBal(instance, accounts[3], 23 - 3)
    assertBal(instance, accounts[4], 24 - 8)
    assertBal(instance, accounts[2], 23 - 1)
    assertBal(instance, accounts[0], 2 + 2)
    assertBal(instance, accounts[1], 7 + 57)
    await assertSumsDontExceedTotal(instance, accounts)

    await instance._updateTotalAtomSupply(126)
    // await print(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)

    await instance._updateTotalAtomSupply(129)
    // await print(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)

    await instance._updateTotalAtomSupply(130)
    // await print(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)

    await instance._updateTotalAtomSupply(73)
    // await print(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)

    await instance.mint(accounts[0], 2)
    // await print(instance, accounts)
    await instance.mint(accounts[0], 2)

    await assertSumsDontExceedTotal(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)

  })

  it("mint() and burn() should properly affect all balances", async () => {
    instance = await MeToken.new()
    await assertPointAtomsConversions(instance, accounts)
    await instance.mint(accounts[0], 100)
    await instance._updateTotalAtomSupply(99)
    await instance.mint(accounts[1], 1)
    await instance.mint(accounts[2], 1)
    await instance.mint(accounts[3], 1)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    await instance.mint(accounts[4], 100)

    // await print(instance, accounts)

    await instance.mint(accounts[4], 100)

    // await print(instance, accounts)

    await assertSumsDontExceedTotal(instance, accounts)

    await assertPointAtomsConversions(instance, accounts)
// ok basically the minting works flawlessly i believe. should check more 
// the burning function now, to see if it could have the problem Ive been essentially looking for here
  })

  it("mint() should properly affect all balances", async () => {
  // next do one with primes 11 and 1103 where the number of atoms is WAY more than the number of points (hasnt been tested yet)
    instance = await MeToken.new()

    await instance.mint(accounts[0], 7)
    // await print(instance, accounts)
    await instance._updateTotalAtomSupply(1099)
    // await print(instance, accounts)
    await instance.mint(accounts[1], 4)
    // await print(instance, accounts)

    await instance.mint(accounts[2], 137)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)
  })

// test burn next
  it("mint() and burn() should properly affect all balances", async () => {
  // next do one with primes 11 and 1103 where the number of atoms is WAY more than the number of points (hasnt been tested yet)
    instance = await MeToken.new()

    await instance.mint(accounts[0], 7)
    // await print(instance, accounts)
    await instance._updateTotalAtomSupply(1099)
    // await print(instance, accounts)
    await instance.mint(accounts[1], 4)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)

    await instance.mint(accounts[2], 137)
    // await print(instance, accounts)
    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)
  })

  it("there is always less liabilities have been burned then assets ever minted", async () => {
    instance = await MeToken.new()
    await assertPointAtomsConversions(instance, accounts)
    await instance.mint(accounts[0], new BN(2))
    await instance.mint(accounts[1], new BN(24))
    await instance.mint(accounts[2], new BN(8))
    await instance.mint(accounts[3], new BN(34))
    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)
    // await print(instance, accounts)

    await instance._updateTotalAtomSupply(34)

    // await print(instance, accounts)

    var bal1 = await instance.balanceOf(accounts[1])
    await instance.burn(accounts[1], new BN(bal1))

    var bal2 = await instance.balanceOf(accounts[2])
    await instance.burn(accounts[2], new BN(bal2))

    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)


    await instance._updateTotalAtomSupply(9)
    await assertPointAtomsConversions(instance, accounts)
    await assertSumsDontExceedTotal(instance, accounts)
    await print(instance, accounts)
  })
})


