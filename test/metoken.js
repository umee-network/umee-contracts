const MeToken = artifacts.require("MeToken");

contract("MeToken test", async accounts => {
  it("should deploy properly", async () => {
    var instance = await MeToken.deployed()
    var totalSupply = await instance.totalSupply()
    assert.equal(totalSupply.toString(), 1)
  })

  it("should mint", async () => {
    var amount = 2

    var instance = await MeToken.deployed()

    var balance = await instance.balanceOf(accounts[0])
    assert.equal(balance.toString(), 0)

    await instance.mint(accounts[0], amount)
    var totalSupply = await instance.totalSupply()
    assert.equal(totalSupply.toString(), amount + 1)

    var balance = await instance.balanceOf(accounts[0])
    assert.equal(balance.toString(), 2)
  })
  it("should mint more", async () => {
    var amount = 4
    // var instance = await MeToken.new();
    var instance = await MeToken.deployed()

    var balance = await instance.balanceOf(accounts[1])
    assert.equal(balance.toString(), 0)

    var balance = await instance.balanceOf(accounts[0])
    assert.equal(balance.toString(), 2)

    await instance.mint(accounts[1], amount)
    var totalSupply = await instance.totalSupply()
    assert.equal(totalSupply.toString(), amount + 3)

    var balance = await instance.balanceOf(accounts[0])
    assert.equal(balance.toString(), 2)

    var balance = await instance.balanceOf(accounts[1])
    assert.equal(balance.toString(), amount)
  })
  it("should rebase evenly", async () => {
    var amount = 2

    var instance = await MeToken.deployed()

    var balance = await instance.balanceOf(accounts[0])
    assert.equal(balance.toString(), 0)

    await instance.mint(accounts[0], amount)
    var totalSupply = await instance.totalSupply()
    assert.equal(totalSupply.toString(), amount + 1)

    var balance = await instance.balanceOf(accounts[0])
    assert.equal(balance.toString(), 2)
  })

  // it("should send coin correctly", async () => {
  //   // Get initial balances of first and second account.
  //   const account_one = accounts[0];
  //   const account_two = accounts[1];

  //   const amount = 10;

  //   const instance = await MeToken.deployed();
  //   const meta = instance;

  //   const balance = await meta.getBalance.call(account_one);
  //   const account_one_starting_balance = balance.toNumber();

  //   balance = await meta.getBalance.call(account_two);
  //   const account_two_starting_balance = balance.toNumber();
  //   await meta.sendCoin(account_two, amount, { from: account_one });

  //   balance = await meta.getBalance.call(account_one);
  //   const account_one_ending_balance = balance.toNumber();

  //   balance = await meta.getBalance.call(account_two);
  //   const account_two_ending_balance = balance.toNumber();

  //   assert.equal(
  //     account_one_ending_balance,
  //     account_one_starting_balance - amount,
  //     "Amount wasn't correctly taken from the sender"
  //   );
  //   assert.equal(
  //     account_two_ending_balance,
  //     account_two_starting_balance + amount,
  //     "Amount wasn't correctly sent to the receiver"
  //   );
  // });
});