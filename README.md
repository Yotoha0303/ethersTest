ethers.js学习文档

前置（node调整）

1、初始化 npm init 

2、package.json 添加key:value("type":"module")
```
//origin
{
  "name": "helloethers",
  "version": "1.0.0",
  "main": "helloEthers.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "ethers": "^6.13.5"
  }
}

//update
{
  "name": "helloethers",
  "version": "1.0.0",
  "main": "helloEthers.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "ethers": "^6.13.5"
  }
}

```
3、卸载和更新ethers的方法
3-1、npm uninstall（卸载）
```
npm uninstall ethers
```
3-2、npm i或者npm install（安装）
npm i ethers@version
```
npm i ethers@5.6.9
```
v5和v6 Provider差异
1、ethers v5获取提供者
```
// 导入ethers包 ethers @5.6.9
import { ethers } from "ethers";

//默认接口
// const provider = ethers.getDefaultProvider();

//infura RPC接口测试
const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/576687aea23547339f330734c743493b");
const address = '0x77173210fcc86DA4bf64f11fb665E6d01eC268c8'

const main = async ()=>{
    //查询提供状态
    // console.log(provider);

    //获取当前network中，链上的测试币数量
    const balance = await provider.getBalance(address)
    console.log(`\nETH Balance of ${address} --> ${ethers.utils.formatEther(balance)} ETH\n`);
}
main()
```
2、ethers v6获取提供者
```
// 导入ethers包 ethers @6.13.5
import { ethers } from "ethers";

//ethers v6 可以获取数据，是主网的数据mainnet
const provider = ethers.getDefaultProvider();

//无法获取到数据
// const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/576687aea23547339f330734c743493b");
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
```
