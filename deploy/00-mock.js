const { developmentChains , Decimals , intialNumber}  = require("../helper-hardhat-config")

module.exports = async function ({getNamedAccounts , deployments}) {
    const {deploy , log} = deployments;
    const{deployer} = await getNamedAccounts();
    
    const chainId = network.config.chainId;
    if(developmentChains.includes(network.name)){
        log("Deploying MockV3Aggregator ....")
         await deploy("MockV3Aggregator" , {
            from : deployer , 
            args : [Decimals , intialNumber] , 
            log : true
        });
        log("MockV3Aggregator Deployed Succesfully !!");
        log("__________________________");
    }
}

module.exports.tags = [
    "all" , "mock"
]