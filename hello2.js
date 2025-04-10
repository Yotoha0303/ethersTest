import { ethers } from "ethers";

//ethers v6 可以获取数据，是主网的数据mainnet
const provider = ethers.getDefaultProvider();

//无法获取到数据
// const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOU_KEY");
//vitalik.eth
const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
//myWallent
const myWallent = "0x77173210fcc86DA4bf64f11fb665E6d01eC268c8";


const main = async () => {
    //无法获取JsonRpcProvider里的数据
    // console.log(provider);

    try {
        //必须要添加await进行请求，不然无法获取数据
        const balance = await provider.getBalance(address);
        console.log(`balance is ${ethers.formatEther(balance)}`);
    } catch (error) {
        console.log("错误代码："+error);
    }
}

main()
