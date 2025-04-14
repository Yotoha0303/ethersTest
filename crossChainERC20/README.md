###  前置条件

1、在钱包中的两条任意测试链(如:Ethereum holesky和sepolia)上有代币，且在这两条测试链上都支持交易广播（用于后期查看交易哈希和块信息）

2、在测试时可以使用两个不同的浏览器（如:chrome和brave）


###  操作流程

1、启动`浏览器1`上的remix，在sepolia上部署合约

```
name:			AETH sepolia
symbol:			AETH
totalSupply:	10000
```

2、启动`浏览器2`，在另外一条链上部署合约（holesky）。同样填写上述数据给构造函数

3、启动监听`node crosschain_origin.js`

4、开始测试

在sepolia查看balance，应该有10000代币（初始）。sepolia调用`bridge`函数，查看`balanceOf`函数中，当前钱包所剩的代币的减少等于跨链发送出去的代币

在holesky查看当前钱包地址的balance，发现初始代币`10000`多出的数量等于sepolia跨链发送过来的代币数量

5、测试完成
