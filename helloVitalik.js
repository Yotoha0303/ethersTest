// ethers @6.13.5
import { JsonRpcProvider, ethers } from 'ethers';

// Connect to the Ethereum network
const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/IYI7vfqc5egsDWgcIMDEKsNkpE5NzosH");

// Get block by number
const blockNumber = "latest";
const block = await provider.getBlock(blockNumber);
console.log(block);

//为空
// console.log(provider);
try {
    const balance = await provider.getBalance(`vitalik.eth`);
    console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
} catch (error) {
    console.log("错误代码" + error);
}
