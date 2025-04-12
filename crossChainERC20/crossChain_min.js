import { ethers, JsonRpcProvider } from "ethers";

//初始化两条链
// const providerSepolia = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/YOU_KEY");
// const providerHolesky = new JsonRpcProvider("https://eth-holesky.g.alchemy.com/v2/YOU_KEY");

//使用wss订阅获取事件消息
const providerSepolia = new ethers.WebSocketProvider("wss://eth-sepolia.g.alchemy.com/v2/YOU_KEY");
const providerHolesky = new ethers.WebSocketProvider("wss://eth-holesky.g.alchemy.com/v2/YOU_KEY");

//钱包私钥
const privateKey = "YOU_WALLET";
const walletSepolia = new ethers.Wallet(privateKey, providerSepolia);
const walletHolesky = new ethers.Wallet(privateKey, providerHolesky);

//已经部署的合约地址（部署后在链上的地址不一定相同）
const contractAddressSepolia = "0x5A31205a893b796F71aB4A88dE95B18c1d69EAAF";
const contractAddressHolesky = "0x3970C7727D54A4d90EbB630293Bccb377Fd9663f";

const abi = [
    "event Bridge(address indexed user,uint256 amount)",
    "function bridge(uint256 amount) public",
    "function mint(address to,uint amount) external",
];

const contractSepolia = new ethers.Contract(contractAddressSepolia, abi, walletSepolia);
const contractHolesky = new ethers.Contract(contractAddressHolesky, abi, walletHolesky);

const main = async () => {
    try {

        //监听Holesky的Bridge事件，然后再Sepolia上执行mint操作，完成跨链
        contractHolesky.on("Bridge", async (user, amount) => {
            try {
                console.log(`Bridge event on Chain Holesky: User ${user} burned ${amount} tokens`);
              
                let tx = await contractSepolia.mint(user, amount);
                const receipt = await tx.wait();
              
                console.log(`Minted ${amount} tokens to ${user} on Chain Sepolia`);
        });

        //监听Sepolia的Bridge事件，然后再Holesky上执行mint操作，完成跨链
        contractSepolia.on("Bridge", async (user, amount) => {
            try {
                console.log(`Bridge event on Chain Sepolia: User ${user} burned ${amount} tokens`);
              
                let tx = await contractHolesky.mint(user, amount);
                const receipt = await tx.wait();
              
                console.log(`Minted ${amount} tokens to ${user} on Chain Holesky`);

        });
    } catch (e) {
        //报错代码：-32000,表示存在一个链不支持监听操作；单独检查`contract_XX_Address.on()`函数
        console.log(e);
    }
}
main();
