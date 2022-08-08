const { deploy, deployments, getNamedAccounts, ethers  } = require("hardhat");
const {assert , expect} = require("chai");
// const { it } = require("node:test");
// const { it } = require("node:test");

describe("FundMe", function () {
    //Deploy thee test
    let FundMe, deployer , MockV3Aggregator , OneEth = ethers.utils.parseEther("1");
    beforeEach("Deploy the contract", async function () {
        // FundMe =
        deployer = ( await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        FundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract("MockV3Aggregator" , deployer)
    });

    describe("Constructor" , async function (){
        it("Check aggregator address is correct" , async function(){
            const response = await FundMe.s_priceFeed();
            assert.equal(response , MockV3Aggregator.address);
        })       
    });
    describe("Fund Function " , async function(){
        it("Send required Amount" , async function (){
            await expect(FundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
        })
        it("Update the value of user" , async function(){
            await FundMe.fund({value : OneEth});
            const response = await FundMe.s_addressToAmountFunded(deployer);
            // console.log(`The value of Fund Me is ${response}`);
            // console.log(`The value of One eth to string is ${OneEth.toString()}`)
            assert.equal(response.toString() , OneEth.toString());
        })
        it("Push our deployer into array" , async function(){
            await FundMe.fund({value:OneEth});
            const response = await FundMe.s_funders(0);
            assert.equal(response , deployer);
        })
    })
    describe("Withdraw" , async function(){
        it("Checking everyones balance is equal to 0" , async function(){
            // await FundMe.withdraw();
            //Arrange
            // const startingFundBalance = await FundMe.provider.getBalance(FundMe.address)
            // const startingDeployerBalance = await FundMe.provider.getBalance(deployer);
            // //Act
            // const transactionCost = await FundMe.withdraw();
            // const transactionRecipet = await transactionResponse.wait(1);


            // const endingFundBalance = await FundMe.provider.getBalance(FundMe.address);
            // const endingDeployerBalance = await FundMe.provider.getBalance(deployer);
            // //assert
            // assert.equal(endingFundBalance ,0)
            // assert.equal(startingDeployerBalance.add(startingDeployerBalance) , endingDeployerBalance.add(gasCost).toString())

            const startFundMeBalance = await FundMe.provider.getBalance(FundMe.address); // you can use ethers or fundMe to use providers
            const startDeployerBalance = await FundMe.provider.getBalance(deployer);//Same goes for here

            const transactionCost = await FundMe.draw();
            const transactionRecipet = await transactionCost.wait(1);
            const {gasUsed , effectiveGasPrice} = transactionRecipet
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const endingFundBalance = await FundMe.provider.getBalance(FundMe.address);
            const endingDeployerBalance = await FundMe.provider.getBalance(deployer);

            assert.equal(endingFundBalance , 0);
            assert.equal(startFundMeBalance.add(startDeployerBalance).toString() , 
            endingDeployerBalance.add(gasCost).toString())
        })   
        // it("Cheking for multiple accounts" ,async function (){
            it("is allows us to withdraw with multiple s_funders", async () => {
                // Arrange
                const accounts = await ethers.getSigners()
                for (i = 1; i < 6; i++) {
                    const fundMeConnectedContract = await FundMe.connect(
                        accounts[i]
                    )
                    await fundMeConnectedContract.fund({ value: OneEth })
                }
                const startingFundMeBalance =
                    await FundMe.provider.getBalance(FundMe.address)
                const startingDeployerBalance =
                    await FundMe.provider.getBalance(deployer)

                // Act
                const transactionResponse = await FundMe.draw()
                // Let's comapre gas costs :)
                // const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait()
                const { gasUsed, effectiveGasPrice } = transactionReceipt
                const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
                console.log(`GasCost: ${withdrawGasCost}`)
                console.log(`GasUsed: ${gasUsed}`)
                console.log(`GasPrice: ${effectiveGasPrice}`)
                const endingFundMeBalance = await FundMe.provider.getBalance(
                    FundMe.address
                )
                const endingDeployerBalance =
                    await FundMe.provider.getBalance(deployer)
                // Assert
                assert.equal(
                    startingFundMeBalance
                        .add(startingDeployerBalance)
                        .toString(),
                    endingDeployerBalance.add(withdrawGasCost).toString()
                )
                // Make a getter for storage variables
                await expect(FundMe.s_funders(0)).to.be.reverted

                for (i = 1; i < 6; i++) {
                    assert.equal(
                        await FundMe.s_addressToAmountFunded(
                            accounts[i].address
                        ),
                        0
                    )
                }
        })     
        it("OnlyOwner" , async function(){
            const accounts = await ethers.getSigners();

            const attacker = accounts[1];
            const attackerConnect = FundMe.connect(attacker);
            await expect(attackerConnect.draw()).to.be.reverted
        })

        it("CheaperWithdraw", async () => {
            // Arrange
            const accounts = await ethers.getSigners()
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await FundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: OneEth })
            }
            const startingFundMeBalance =
                await FundMe.provider.getBalance(FundMe.address)
            const startingDeployerBalance =
                await FundMe.provider.getBalance(deployer)

            // Act
            const transactionResponse = await FundMe.cheaperWithdraw()
            // Let's comapre gas costs :)
            // const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
            console.log(`GasCost: ${withdrawGasCost}`)
            console.log(`GasUsed: ${gasUsed}`)
            console.log(`GasPrice: ${effectiveGasPrice}`)
            const endingFundMeBalance = await FundMe.provider.getBalance(
                FundMe.address
            )
            const endingDeployerBalance =
                await FundMe.provider.getBalance(deployer)
            // Assert
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(withdrawGasCost).toString()
            )
            // Make a getter for storage variables
            await expect(FundMe.s_funders(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await FundMe.s_addressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
    })     
    })
});
