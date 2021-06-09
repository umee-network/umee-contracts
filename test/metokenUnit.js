/*
THINGS TO TEST
 - burn throws when you try to burn more than you have

*/



const MeToken = artifacts.require("MeToken");
const { print, assertBal, assertSumsDontExceedTotal } = require("./utils")

let instance;

contract("MeToken Unit Tests", async accounts => {
  // before(async () => {
  //   instance = await MeToken.new()
  // })
  beforeEach(async () => {
    // instance = await MeToken.new()

    // await print(instance, accounts)

    // await instance.mint(accounts[0], 2)
    // await instance.mint(accounts[1], 7)
    // await instance.mint(accounts[2], 23)
    // await instance.mint(accounts[3], 23)
    // await instance.mint(accounts[4], 24)

    // await print(instance, accounts)

    // await instance.burn(accounts[3], 3)
    // await instance.burn(accounts[4], 8)
    // await instance.burn(accounts[2], 1)
    
    // assertBal(instance, accounts[3], 23 - 3)
    // assertBal(instance, accounts[4], 24 - 8)
    // assertBal(instance, accounts[2], 23 - 1)

    // await print(instance, accounts)
    
    // await instance.mint(accounts[0], 2)
    // await instance.mint(accounts[1], 57)

    // await print(instance, accounts)



    // var totalSupply = await instance.totalSupply()
    // assert.equal(totalSupply.toString(), 2 + 1)

    // var balance = await instance.balanceOf(accounts[0])
    // assert.equal(balance.toString(), 2)
    // print()


  })

  it("should deploy properly", async () => {
    // var instance = await MeToken.new()
    // var totalSupply = await instance.totalSupply()
    // assert.equal(totalSupply.toString(), 1)
  })

  // it("should mint", async () => {
  //   var amount = 2

  //   var instance = await MeToken.new()

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 0)

  //   await instance.mint(accounts[0], amount)
  //   var totalSupply = await instance.totalSupply()
  //   assert.equal(totalSupply.toString(), amount + 1)

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 2)
  // })


// this is from the other file from when we deployed with 1,1 
// they dont worl anymore since we deploy with 1e18, 1e18
// find a way to test their same things though
  // it.only("should deploy properly", async () => {
  //   var instance = await MeToken.new();

  //   var totalSupply = await instance.totalSupply()
  //   assert.equal(totalSupply.toString(), 1)
  // })

  // it.only("should mint", async () => {

  //   var instance = await MeToken.new();

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 0)

  //   await instance.mint(accounts[0], 2)
  //   var totalSupply = await instance.totalSupply()
  //   assert.equal(totalSupply.toString(), 2 + 1)

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 2)
  // })
  // it.only("should mint more", async () => {

  //   var instance = await MeToken.new();
  //   var balance = await instance.balanceOf(accounts[1])
  //   assert.equal(balance.toString(), 0)

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 2)

  //   await instance.mint(accounts[1], 4)
  //   var totalSupply = await instance.totalSupply()
  //   assert.equal(totalSupply.toString(), 4 + 3)

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 2)

  //   var balance = await instance.balanceOf(accounts[1])
  //   assert.equal(balance.toString(), 4)
  // })
  // it.only("should rebase evenly", async () => {

  //   var instance = await MeToken.new();

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 2) 

  //   await instance.mint(accounts[0], 2)
  //   var totalSupply = await instance.totalSupply()
  //   assert.equal(totalSupply.toString(), 4 + 3 + 2)

  //   var balance = await instance.balanceOf(accounts[0])
  //   assert.equal(balance.toString(), 2 + 2) 

  //   await print(instance, accounts)
  // })

});

// async function print(){
//   let x = instance

// }