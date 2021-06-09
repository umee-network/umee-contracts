BN = require('bn.js')

var assertInvariants = async (instance, accounts) => {
  await assertSumsDontExceedTotal(instance, accounts)
  await assertPointAtomsConversions(instance, accounts)
}

var assertPointAtomsConversions = async (instance, accounts) => {
  //atomsToPoints
  //primes: 11, 1103
  var testVals = ['1', '2', '3', '4', '5', '6', '7', '51', '99', '100', '101',
  '9999999', '2047', '2048', '2049', '1340983573567236123988759387037', '92309856384374394948202856738198']
  for (var i = 0; i < testVals.length; i++) {
    var t = new BN(testVals[i])
    var points = await instance.atomsToPoints(t)
    var atoms = await instance.pointsToAtoms(points)
    assert.isTrue(atoms.gte(t)) // actually I think this should be atoms >= pts. Does the new amount of atoms...
    points = await instance.atomsToPoints(atoms)
    var atoms2 = await instance.pointsToAtoms(points)
    assert.isTrue(atoms.eq(atoms)) 

    var atoms = await instance.pointsToAtoms(t)
    var points = await instance.atomsToPoints(atoms)
    assert.isTrue(points.lte(t))
    atoms = await instance.pointsToAtoms(points)
    var points2 = await instance.atomsToPoints(atoms)
    assert.isTrue(points.eq(points2)) // again im not sure if its true necessarily
  }
}

var assertSumsDontExceedTotal = async (instance, accounts) => {
  var _totalAtoms = await instance._totalAtoms()
  var _totalPoints = await instance._totalPoints()

  var a0bal = await instance.balanceOf(accounts[0])
  var a1bal = await instance.balanceOf(accounts[1])
  var a2bal = await instance.balanceOf(accounts[2])
  var a3bal = await instance.balanceOf(accounts[3])
  var a4bal = await instance.balanceOf(accounts[4])
  var bSum = a0bal.add(a1bal).add(a2bal).add(a3bal).add(a4bal)

  var a0p = await instance._points(accounts[0])
  var a1p = await instance._points(accounts[1])
  var a2p = await instance._points(accounts[2])
  var a3p = await instance._points(accounts[3])
  var a4p = await instance._points(accounts[4])
  var pSum = a0p.add(a1p).add(a2p).add(a3p).add(a4p)

  var AperP = _totalAtoms.div(_totalPoints)
  // console.log( bSum.toString(), pSum.toString(), bSum, pSum)
  var actualAperP

  if(pSum.eq(new BN(0))){
    if(bSum.eq(new BN(0))){
      actualAperP = new BN(0)
    } else{
      actualAperP = new BN(1e100)
    }
  } else{
    actualAperP = bSum.div(pSum)
  }

  assert.isTrue(_totalAtoms.gte(bSum), "Sum of atoms balances exceeds _totalAtoms")
  assert.isTrue(_totalPoints.gte(pSum), "Sum of point balances exceeds _totalPoints")
  assert.isTrue(AperP.gte(AperP), "actual atom liabilities must exceed atomsPerPoint (exchange rate)")

}


var snapshot = async (instance, accounts) => { 
    // await Promise.All()
    // return newAccounts
}

var assertPts = async (instance, account, expected) => {
    var pts = await instance._points(account)
    assert.equal(pts.toString(), expected)
}

var assertBal = async (instance, account, expected) => {
    var bal = await instance.balanceOf(account)
    assert.equal(bal.toString(), expected)
}




var print = async (instance, accounts) => {
  String.prototype.ps = String.prototype.padStart
  const L = 36 // BOX_LENGTH

  var _totalAtoms = await instance._totalAtoms()
  var _totalPoints = await instance._totalPoints()
  var ta = _totalAtoms.toString().ps(L)
  var tp = _totalPoints.toString().ps(L)

  var a0bal = await instance.balanceOf(accounts[0])
  var a1bal = await instance.balanceOf(accounts[1])
  var a2bal = await instance.balanceOf(accounts[2])
  var a3bal = await instance.balanceOf(accounts[3])
  var a4bal = await instance.balanceOf(accounts[4])
  var b0 = a0bal.toString().ps(L)
  var b1 = a1bal.toString().ps(L)
  var b2 = a2bal.toString().ps(L)
  var b3 = a3bal.toString().ps(L)
  var b4 = a4bal.toString().ps(L)

  var a0p = await instance._points(accounts[0])
  var a1p = await instance._points(accounts[1])
  var a2p = await instance._points(accounts[2])
  var a3p = await instance._points(accounts[3])
  var a4p = await instance._points(accounts[4])
  var p0 = a0p.toString().ps(L)
  var p1 = a1p.toString().ps(L)
  var p2 = a2p.toString().ps(L)
  var p3 = a3p.toString().ps(L)
  var p4 = a4p.toString().ps(L)

  var bSum = a0bal.add(a1bal).add(a2bal).add(a3bal).add(a4bal)
  var pSum = a0p.add(a1p).add(a2p).add(a3p).add(a4p)


  console.log("\nCONTRACT STATUS")
  console.log("=========================================================================================")
  console.log("|         |                           Atoms |                          Points |")
  console.log("|=======================================================================================|")
  console.log("|Account0 |", b0, "|", p0, "|")
  console.log("|Account1 |", b1, "|", p1, "|")
  console.log("|Account2 |", b2, "|", p2, "|")
  console.log("|Account3 |", b3, "|", p3, "|")
  console.log("|Account4 |", b4, "|", p4, "|")
  console.log("|---------------------------------------------------------------------------------------|")
  console.log("|   TOTAL |", ta, "|", tp, "|")
  console.log("|   (sum) |", bSum.toString().ps(L), "|", pSum.toString().ps(L), "|")
  console.log("=========================================================================================")
  var tpDivTa = _totalPoints.div(_totalAtoms)
  // console.log("_totalPoints/_totalAtoms: ", tpDivTa.toString().ps(L), "^-1: ", (new BN(1)).div(tpDivTa).toString().ps(L))

  var pSumDivBSum 
  var bSumDivpSum 
  if(pSum.eq(new BN(0)) && bSum.eq(new BN(0))){
    bSumDivpSum = "indeterminate"
    pSumDivBSum = "indeterminate"
  } else if (pSum.eq(new BN(0)) || bSum.eq(new BN(0))){
      // throw new Error("divide by zero")
    bSumDivpSum = "possible divide by zero"
    pSumDivBSum = "possible divide by zero"
  } else {
    pSumDivBSum = pSum.div(bSum).toString()
    bSumDivpSum = bSum.div(pSum).toString()
  }

  console.log("pSum/bSum:                ", pSumDivBSum.ps(L), "bSum/pSum", bSumDivpSum.ps(L))
  // console.log("Atoms Per Point: ", (_totalAtoms.div(_totalPoints).toString().ps(L), "\n")
}


module.exports = { print , assertBal, assertPts, assertSumsDontExceedTotal, assertPointAtomsConversions}
