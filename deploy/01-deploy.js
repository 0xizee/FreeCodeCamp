// const { verify } = require("crypto");
const {Verify} = require("../utils/verify")
const {networkConfig , developmentChains}  = require("../helper-hardhat-config")
const {network} = require(
    "hardhat"
)
module.exports = async function ({getNamedAccounts , deployments}) {
    const {deploy , log ,get} = deployments;
    const{deployer} = await getNamedAccounts();

    const chainId = network.config.chainId;
    let ethUsdFeedAddress ;
    if(developmentChains.includes(network.name)){
        const MockV3 = await get("MockV3Aggregator");
        ethUsdFeedAddress = MockV3.address;
    }else{
    ethUsdFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const FundMe = await deploy("FundMe" , {
        from : deployer ,
        args : [ethUsdFeedAddress],
        log : true,
        waitConfirmations : network.config.waitConfirmations || 1
            
        
    })
    if(!developmentChains.includes(network.name)){
      await Verify(FundMe.address , [ethUsdFeedAddress])       
    //    log(verify.address)
    }

}
module.exports.tags = ["all" , "fundMe"];