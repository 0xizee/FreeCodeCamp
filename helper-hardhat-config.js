const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    },
}
const Decimals = 8;
const intialNumber = 200000000000
const developmentChains = ["localhost" , "hardhat"];
module.exports = {
    networkConfig,
    developmentChains,
    Decimals , 
    intialNumber
}