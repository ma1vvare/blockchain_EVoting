var fs = require('fs');
var Web3 = require('web3');
var Cryptr=require('cryptr');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');
var jsbn = require('/Users/peter087744982/node_modules/jsbn');
var sha3_256 = require("js-sha3").sha3_256;
//var BigNumber = require('bignumber.js');
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
var abi = [
    {
		name:'settest',
		type:'function',
		constant:false,
		inputs:
		[
			{
				"name":"sec",
				"type":"string"
			}
		],
		outputs:[]
	},
	{
		name:'gettest',
		type:'function',
		constant:true,
		inputs:[],
		outputs:
		[
			{
				"name":"",
				"type":"string"
			}
		]
	}
];
function determinePID(id){
  var pid=sha3_256(id);
  return pid;
}
function read_id_pid_list(){
  var idlist = fs.readFileSync('voter_id_pid.txt').toString().split("\n");
  for(i in idlist){
    if(idlist[i].length<64){
      idlist.splice(i,1);
    }
  }
  //console.log(idlist);
  //console.log("PID concatenate:");
  var ans ='';
  for(i in idlist){
    ans = ans + idlist[i] + "\n";
  }
  //console.log("ans:\n",ans);
  //Then, write back to smart contract.
  var re = ins.settest(ans,{from:web3.eth.coinbase,gas: "1000000"});
  var result=ins.gettest();
}
function WriteToFile() {
  //write id & pid
  fs.appendFile("voter_id_pid.txt",id.toString()+'\n'+pid.toString()+'\n',
  function(err) {
      if(err) {
          console.log(err);
      } else {
        console.log("The voter_id_pid file was saved!");
  }
  });
}
//main funvtion
var myContract = web3.eth.contract(abi);
var ins = myContract.at('0xdc8c9d7c0936f3bb5de369c12913757fb74ea283');
var id=process.argv[2];
var pid=determinePID(id.toString());
//console.log("id : "+id);
//console.log("pid : "+pid);
WriteToFile();
setTimeout(read_id_pid_list(),2000);
//read_id_pid_list();
