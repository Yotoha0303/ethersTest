// 导入ethers包 ethers @5.6.9
import { ethers } from "ethers";

//默认接口(可以获取到链上信息)
const provider = ethers.getDefaultProvider();

//infura RPC接口测试
//const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOU_KEY");
//vitalik.eth or 0xd8da6bf26964af9d7eed9e03e53415d37aa96045
const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

const main = async ()=>{
    //查询提供状态
    // console.log(provider);

    //获取当前network中，链上的测试币数量
    const balance = await provider.getBalance(address)
    console.log(`\nETH Balance of ${address} --> ${ethers.utils.formatEther(balance)} ETH\n`);
}
main()
