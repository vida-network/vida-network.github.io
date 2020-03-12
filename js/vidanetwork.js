// 导入vnt.js库和ethereumjs-tx库
var fs = require('fs'); 
var Vnt = require('vnt');
var vntkit = require('vnt-kit');
//var TX = require('ethereumjs-tx').Transaction;
var TX = require('ethereumjs-tx');
var vnt = new Vnt();

// 创建 vnt provider连接
vnt.setProvider(new vnt.providers.HttpProvider("http://39.97.235.82:8880"));//主网
//vnt.setProvider(new vnt.providers.HttpProvider("http://47.111.100.232:8880"));//测试网
var chainid = 1  //主网是1

// 从文件系统中读取代码和abi
// 定义代码路径
// var codeFile = "/src/github.com/vntchain/bottle/build/contracts/vidat1/$VIDA.compress"
// 定义abi路径
var abiFile = "/src/github.com/vntchain/bottle/build/contracts/vida/VIDA.abi"
// 读取abi数据
var wasmabi = fs.readFileSync(abiFile)
// 将abi数据解析成json
var abi = JSON.parse(wasmabi.toString("utf-8"))

function sendRawTransaction(account,to,data,value){
    var nonce = vnt.core.getTransactionCount(account.address);
    // var gasLimit = vnt.core.estimateGas({
    //   from: account.address,
    //   to: to,
    //   data: data,
    //   value: value
    // });
    // console.log(gasLimit)
    var gasPrice = vnt.core.gasPrice;
    var options = {
      nonce: vnt.toHex(nonce),
      to: to,
      gasPrice: vnt.toHex(gasPrice),
      gasLimit: vnt.toHex(4000000),
      data: data,
      value: value,
      chainId: chainid
    };
    
    var tx = new TX(options);
    tx.sign(Buffer.from(account.privateKey.substring(2,),'hex'));
    var serializedTx = tx.serialize();
    vnt.core.sendRawTransaction('0x' + serializedTx.toString('hex'), 
    function(err, txHash){
        if (err) {
            console.log("err happened: ", err);
        } else {
            console.log("transaction hash: ", txHash);
            getTransactionReceipt(txHash, function(receipt){
                console.log("tx receipt: ", receipt)
                console.log("tx status: ", receipt.status)
                console.log("contract address: ", receipt.contractAddress)
                if (receipt.contractAddress != null)
                {
                  contractAddress = receipt.contractAddress
                  console.log("update contract address ", contractAddress)
                }
            })
        }
    });
  }

function getTransactionReceipt(tx, cb) {
    var receipt = vnt.core.getTransactionReceipt(tx);
    if (!receipt) {
      setTimeout(function() {
        getTransactionReceipt(tx, cb)
      }, 1000);
    } else {
      cb(receipt)
    }
  }

//=============== 下面添加你需要的函数 ================ //

function assignadmin(owner, admin)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("assignadmin", [admin]);
  sendRawTransaction(owner, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function assignbounty(admin, bounty)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("assignbounty", [bounty]);
  sendRawTransaction(admin, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function assignteam(admin, team)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("assignteam", [team]);
  sendRawTransaction(admin, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function transfer(sender, to, amount) 
{
    //调用发送交易
    console.log(contractAddress);
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("transfer", [to, vnt.toWei(amount, 'vnt')]);
    sendRawTransaction(sender, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
    
}

function getvida(sender, amount)
{
    //调用发送交易
    console.log(contractAddress);
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("$getvida", [vnt.toWei(amount, 'vnt')]);
    sendRawTransaction(sender, contractAddress, data, vnt.toHex(vnt.toWei(amount, 'vnt')));
}

function getvnt(sender, amount)
{
    //调用发送交易
    console.log(contractAddress);
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("getvnt", [vnt.toWei(amount, 'vnt')]);
    sendRawTransaction(sender, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function burn(sender, amount) 
{
    //调用发送交易
    console.log(contractAddress);
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("burn", [vnt.toWei(amount, 'vnt')]);
    sendRawTransaction(sender, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function withdraw(sender, amount)
{
  console.log(contractAddress)
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("withdraw", [vnt.toWei(amount, 'vnt')]);
  sendRawTransaction(sender, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function approve(owner, proxy, amount)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("approve", [proxy, vnt.toWei(amount, 'vnt')]);
  sendRawTransaction(owner, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function transferByProxy(proxy, owner, to, amount)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("transferFrom", [owner, to, vnt.toWei(amount, 'vnt')]);
  sendRawTransaction(proxy, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function freeze(owner, to, amount, time)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("freeze", [to, vnt.toWei(amount, 'vnt'), time]);
  sendRawTransaction(owner, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function unfreeze(owner, from, amount)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("unfreeze", [from, vnt.toWei(amount, 'vnt')]);
  sendRawTransaction(owner, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function editRestricted(admin)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("editRestricted", []);
  sendRawTransaction(admin, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function editRestrictedAddress(admin, address)
{
  var contract = vnt.core.contract(abi);
  var data = contract.packFunctionData("editRestrictedAddress", [address]);
  sendRawTransaction(admin, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function allevents()
{
  var contract = vnt.core.contract(abi);
  var myContractInstance = contract.at(contractAddress);
  var events = myContractInstance.allEvents([]);
  // watch for changes
  events.watch(function(error, event){
   if (!error)
     console.log(event);
  });
  // Or pass a callback to start watching immediately
  var events = myContractInstance.allEvents([], function(error, log){
   if (!error)
     console.log(log);
  });
}

function start(timestamp) 
{
    //调用发送交易
    console.log(contractAddress);
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("Start", [timestamp]);
    sendRawTransaction(admin, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function stop() 
{
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("Stop");
    sendRawTransaction(admin, contractAddress, data, vnt.toHex(vnt.toWei(0, 'vnt')));
}

function getPeriod()
{
    //查询可以不发送交易
    var contract = vnt.core.contract(abi).at(contractAddress);
    var num = contract.GetPeriod();
    console.log('result', num.toString(10))
}


//1. 部署合约
// deployWasmContract(0);

//2. 其他调用
//start(1575129600);
// stop()


//不产生实际交易的情况

function GetTokenName() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetTokenName", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetTokenName", result).toString())
}

function GetSymbol() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetSymbol", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetSymbol", result).toString())
}

function GetAdmin() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetAdmin", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetAdmin", result).toString());
}

function GetBounty() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetBounty", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetBounty", result).toString())
}

function GetTeam() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetTeam", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetTeam", result).toString())
}

function GetDecimals() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetDecimals", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetDecimals", result).toString())
}

function GetTotalSupply() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetTotalSupply", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetTotalSupply", result), 'vnt').toString())
}

function GetPoolBalance() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetPoolBalance", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }

    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetPoolBalance", result), 'vnt').toString())
}

function GetBountyPoolBalance() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetBountyPoolBalance", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }

    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetBountyPoolBalance", result), 'vnt').toString())
}

// VNT单位是wei
function GetWithdrawalCap() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetWithdrawalCap", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetWithdrawalCap", result), 'vnt').toString())
}

function GetReservedVNT() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetReservedVNT", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetReservedVNT", result), 'vnt').toString())
}

function GetTotalWithdrawal() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetTotalWithdrawal", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetTotalWithdrawal", result), 'vnt').toString())
}

function GetTotalDestroyedVIDA() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetTotalDestroyedVIDA", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetTotalDestroyedVIDA", result), 'vnt').toString())
}

function GetTeamLocked() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetTeamLocked", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetTeamLocked", result), 'vnt').toString())
}

function GetAmount(address) {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("GetAmount", [address]);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetAmount", result), 'vnt').toString())
}

function GetAllowance(owner, proxy) {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("GetAllowance", [owner, proxy]);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetAllowance", result), 'vnt').toString())
}

function GetTotalFrozenAmount(address) {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("GetTotalFrozenAmount", [address]);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetTotalFrozenAmount", result), 'vnt').toString())
}

function GetNodeFrozenAmount(owner, node) {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("GetNodeFrozenAmount", [owner, node]);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetNodeFrozenAmount", result), 'vnt').toString())
}

function GetNodeFrozenExpiry(owner, node) {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("GetNodeFrozenExpiry", [owner, node]);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetNodeFrozenExpiry", result).toString())
}

function GetNodeFrozenBalance(node) {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("GetNodeFrozenBalance", [node]);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(vnt.fromWei(contract.unPackOutput("GetNodeFrozenBalance", result), 'vnt').toString())
}

function GetTime() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("GetTime", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("GetTime", result).toString());
}

function isRestricted() {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi);
    var data = contract.packFunctionData("isRestricted", []);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options);
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("isRestricted", result).toString());
}

function isRestrictedAddress(address) {
    // 通过abi生成合约实例
    var contract = vnt.core.contract(abi)
    var data = contract.packFunctionData("isRestrictedAddress", [address]);
    // 生成交易的结构体，指定to, data等字段
    var options = {
       to: contractAddress,    // 该字段为合约地址
       data: data           // 该字段为合约调用的data
    }
    // 使用vnt.core.call方法进行查询，不会发起交易
    var result = vnt.core.call(options)
    // 对结果进行解码，得出结果。
    console.log(contract.unPackOutput("isRestrictedAddress", result).toString());
}



//部署合约后，后得到合约地址，然后替换这个变量，后面的函数调用

//t1 final test
var contractAddress = "0xdcc040f7a6b2a72cb642364b5e74582fb4a26716";




// cli
//  /src/github.com/vntchain/bottle/build/bin/bottle compile -code "/src/github.com/vntchain/bottle/build/contracts/vidat1/vidat1.c" -output "/src/github.com/vntchain/bottle/build/contracts/vidat1"

// deployWasmContract(0)
// 基本功能
// 代理功能
// 燃烧代币功能
// 原生和代币互换功能
// VIDA最小单位wei有18位
// 黑洞地址0x0000000000000000000000000000000000000000
// creator, admin, bounty, team