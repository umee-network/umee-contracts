const Rpc = require('isomorphic-rpc')
const network = 'mainnet' // process.argv[0] || 
const rpc = new Rpc('https://' + network + '.infura.io/v3/3cb706370956464e9cd6aebdd1c9980d')
const rlp = require('rlp')
const { toHex, keccak } = require('eth-util-lite')
console.log(rpc.provider)

const numConfimationBlocks = 1

async function serve(){
  console.log('\nMONITORING ' + network + ' NETWORK')

  var lastBlockHeight = await rpc.eth_blockNumber()
  while(true){ // until final nonce
    let currentBlockHeight = await rpc.eth_blockNumber()
    if(parseInt(currentBlockHeight) >= parseInt(lastBlockHeight) + numConfimationBlocks){
      console.log('BlockHeight:\t', parseInt(currentBlockHeight))
      // let logs = await rpc.eth_getLogs({"address":"0x4D550B30c46A6a7f1A41e9E2cD87e4124a6C6c0f"})

      let logs = await rpc.eth_getLogs({"address":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]})
      var logTxs = []
      for (var i = 0; i < logs.length; i++) {
        logTxs.push(logs[i]["transactionHash"])
      }
      console.log("LOGS\t", logTxs)
      // let tempthing = await rpc.eth_getTransactionCount("0x1F4E7Db8514Ec4E99467a8d2ee3a63094a90437A")
      // console.log(tempthing)
      lastBlockHeight = currentBlockHeight
    }

    await wait(5)
  }
}

async function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds*1000))
}



serve()


