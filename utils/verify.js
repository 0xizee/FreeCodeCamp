const { run } = require("hardhat")

const Verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    console.log("what happend");
    await run("verify:verify", {
        // log("what ha"),
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    console.log("give the error");
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!")
    } else {
        
      console.log(e)
    }
  }
}

module.exports = { Verify }