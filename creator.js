var Web3 = require('web3');
var Cryptr=require('cryptr');
var fs = require('fs');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');
var jsbn = require('/Users/peter087744982/node_modules/jsbn');
var sha3_256 = require("js-sha3").sha3_256;

//PaillierEncryption
var key;
//generate key pair, will be removed when we can transfer both publicKey & certificate.
function KeyPairGenerator(length){
  if(typeof length=='undefined'){
    key=bn.generate_paillier_keypair();
  }
  else{
    // (length,n,miu,lamda) for verfication
    key=bn.generate_paillier_keypair(1024,'110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512354480649141036034771883979754626168854682020810561237149462330894866226001834553756911158173549227072099959129140112696067075550461986486461532185998540129','2910350249977286689560644073014060523591276981811188036027914826827994299258273797487117795031172344923038606215604032135356578673131411356241122138761613178361630119507286654604785857472231323263626091616104774837304411401550414167434164492237420402656485804688617819983185337867575321066008051980210785901','110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512333412559546473749739635330718907118997552240688969622774780302839332311472733061609296404062737355936258841543351149695208266100756051815301471056277702676');
  }
}
function WriteKeyToFile() {
  //write pk
  fs.writeFile("creator_pk.txt",key['public_key'].toJSON()['n']+'\n'/*+key['public_key'].toJSON()['g']*/,
  function(err) {
      if(err) {
          console.log(err);
      } else {
        console.log("The creator_pk file was saved!");
  }
  });
  //Write sk
  fs.writeFile("creator_sk.txt", /*'lambda : '+*/key['private_key'].toJSON()['lambda']+'\n'+/*'mu : '+*/key['private_key'].toJSON()['mu'],
  function(err) {
      if(err) {
          console.log(err);
      } else {
        console.log("The creator_sk file was saved!");
  }
  });
}
KeyPairGenerator();
WriteKeyToFile();
