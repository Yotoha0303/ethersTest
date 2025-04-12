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
    "event Mint(address indexed to, uint256 amount)",
    "function bridge(uint256 amount) public",
    "function mint(address to,uint amount) external",
];

const contractSepolia = new ethers.Contract(contractAddressSepolia, abi, walletSepolia);
const contractHolesky = new ethers.Contract(contractAddressHolesky, abi, walletHolesky);

const main = async () => {
    try {
        //检查是否是自己的合约 at Sepolia network
        console.log("实际调用的合约地址:", contractSepolia.target || contractSepolia.address);
        console.log("当前使用的钱包地址:", walletSepolia.address);
        console.log("合约方法:", contractSepolia.interface.fragments.map(f => f.name));
        //检查是否是自己的合约 at Holesky network
        console.log("实际调用的合约地址:", contractHolesky.target || contractHolesky.address);
        console.log("当前使用的钱包地址:", walletHolesky.address);
        console.log("合约方法:", contractHolesky.interface.fragments.map(f => f.name));
        console.log(`开始监听跨链事件`);

        //监听Holesky的Bridge事件，然后再Sepolia上执行mint操作，完成跨链
        contractHolesky.on("Bridge", async (user, amount) => {
            try {
                console.log(`Bridge event on Chain Holesky: User ${user} burned ${amount} tokens`);
                let tx = await contractSepolia.mint(user, amount);

                const receipt = await tx.wait();

                //测试1、检查是否有交易成功！
                console.log("交易哈希:", tx.hash);
                console.log("交易状态:", receipt.status);
                console.log(`交易记录:${JSON.stringify(receipt.logs, null, 2)}`);

                //测试2、检查是否是权限问题！
                console.log("当前钱包地址:", walletSepolia.address);

                console.log(`Minted ${amount} tokens to ${user} on Chain Sepolia`);

                //测试3、监听是否触发事件
                // 查询最近 100 个区块内是否发生过 Bridge 事件
                const latestBlock = await providerSepolia.getBlockNumber();
                const logs = await contractSepolia.queryFilter(
                    contractSepolia.filters.Bridge(),  // 事件过滤器
                    latestBlock - 100,  // 起始区块
                    "latest"            // 结束区块
                );

                if (logs.length === 0) {
                    console.log("没有监听到 Bridge 事件（可能是事件没发出，或者节点无法监听）");
                } else {
                    logs.forEach(log => {
                        console.log("监听到 Bridge 事件:", {
                            user: log.args.user,
                            amount: log.args.amount.toString(),
                            txHash: log.transactionHash
                        });
                    });
                }


            } catch (error) {
                console.log(`行内报错1${error}`);
            }
        });

        //监听Sepolia的Bridge事件，然后再Holesky上执行mint操作，完成跨链
        contractSepolia.on("Bridge", async (user, amount) => {
            try {

                console.log(`Bridge event on Chain Sepolia: User ${user} burned ${amount} tokens`);
                let tx = await contractHolesky.mint(user, amount);

                const receipt = await tx.wait();
                //测试1、检查是否有交易成功！
                console.log("交易哈希:", tx.hash);
                console.log("交易状态:", receipt.status);
                console.log(`交易记录:${JSON.stringify(receipt.logs, null, 2)}`);

                //测试2、检查是否是权限问题！
                console.log("当前钱包地址:", walletHolesky.address);

                console.log(`Minted ${amount} tokens to ${user} on Chain Holesky`);

                //测试3、监听是否触发事件
                // 查询最近 100 个区块内是否发生过 Bridge 事件
                const latestBlock = await providerHolesky.getBlockNumber();
                const logs = await contractHolesky.queryFilter(
                    contractHolesky.filters.Bridge(),  // 事件过滤器
                    latestBlock - 100,  // 起始区块
                    "latest"            // 结束区块
                );

                if (logs.length === 0) {
                    console.log("没有监听到 Bridge 事件（可能是事件没发出，或者节点无法监听）");
                } else {
                    logs.forEach(log => {
                        console.log("监听到 Bridge 事件:", {
                            user: log.args.user,
                            amount: log.args.amount.toString(),
                            txHash: log.transactionHash
                        });
                    });
                }

            } catch (error) {
                console.log(`行内报错2${error}`);
            }
        });

        //测试4、直接监听对应的方法
        contractSepolia.on("Mint", async (to, amount) => {
            console.log(`Mint event received: ${to} minted ${amount}`);
        });

        contractHolesky.on("Mint", async (to, amount) => {
            console.log(`Mint event received: ${to} minted ${amount}`);
        });
    } catch (e) {
        //报错代码：-32000,表示存在一个链不支持监听操作；单独检查`contract_XX_Address.on()`函数
        console.log(e);
    }
}
main();
