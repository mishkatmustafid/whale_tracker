const { ethers, Contract } = require("ethers")
const player = require("play-sound")((opts = {}))
const rpcURL = "https://cloudflare-eth.com"
const provider = new ethers.providers.JsonRpcProvider(rpcURL)

const contract_details = require("./contract_details.json")
const CONTRACT_ADDRESS = contract_details["address"]
const CONTRACT_ABI = contract_details["abi"]
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

// Note: USDC uses 6 decimal places
const TRANSFER_THRESHOLD = 100000000000 // wei

const playSound = () => {
  player.play("ding.mp3", function (err) {
    if (err) throw err
  })
}

const main = async () => {
  // playSound()
  const name = await contract.name()
  console.log(
    `Whale tracker started!\nListening for large transfers on ${name}`
  )

  contract.on("Transfer", (from, to, amount, data) => {
    // Note: not all ERC-20 tokens index `amount`
    // Use this instead of Ethers.js query filters
    // https://docs.ethers.io/v5/concepts/events/
    if (amount.toNumber() >= TRANSFER_THRESHOLD) {
      console.log(
        `New whale transfer for ${name}: https://etherscan.io/tx/${data.transactionHash}`
      )
    }
  })
}

main()
