var fs = require('fs');
var Web3 = require('web3');
var Cryptr=require('cryptr');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');
var jsbn = require('/Users/peter087744982/node_modules/jsbn');
var sha3_256 = require("js-sha3").sha3_256;
var prime = 257;
var secret;
secret = process.argv[3];
pid = process.argv[2];
console.log(secret);
console.log(pid);
console.log(typeof secret);

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
var abi = [
  {
    "constant":true,
    "inputs":[],
    "name":"gets5",
    "outputs":[
      {
        "name":"",
        "type":"string"
      }
    ],
    "payable":false,
    "type":"function"
  },
  {
    "constant":false,
    "inputs":[
      {
        "name":"sec",
        "type":"string"
      }
    ],
    "name":"set5",
    "outputs":[],
    "payable":false,
    "type":"function"
  },
  {
    "constant":true,
    "inputs":[],
    "name":"gets2",
    "outputs":
    [
      {
        "name":"",
        "type":"string"
      }
    ],
    "payable":false,
    "type":"function"
  },
  {
    "constant":true,
    "inputs":[],
    "name":"gets1",
    "outputs":
    [
      {
        "name":"",
        "type":"string"
      }
    ],
    "payable":false,
    "type":"function"
  },
  {
    "constant":true,
    "inputs":[],
    "name":"gets4",
    "outputs":
    [
      {
        "name":"",
        "type":"string"
      }
    ],
    "payable":false,
    "type":"function"
  },
  {
    "constant":false,
    "inputs":[
      {
        "name":"sec",
        "type":"string"
      }
    ],
    "name":"set1",
    "outputs":[],
    "payable":false,
    "type":"function"
  },
  {
    "constant":false,
    "inputs":
    [
      {
        "name":"sec",
        "type":"string"
      }
    ],
    "name":"set2",
    "outputs":[],
    "payable":false,
    "type":"function"
  },
  {
    "constant":true,
    "inputs":[],
    "name":"gets3",
    "outputs":
    [
      {
        "name":"",
        "type":"string"
      }
    ],
    "payable":false,
    "type":"function"
  },
  {
    "constant":false,
    "inputs":
    [
      {
        "name":"sec",
        "type":"string"
      }
    ],
    "name":"set3",
    "outputs":[],
    "payable":false,
    "type":"function"
  },
  {
    "constant":false,
    "inputs":
    [
      {
        "name":"sec",
        "type":"string"
      }
    ],
    "name":"set4",
    "outputs":[],
    "payable":false,
    "type":"function"
  }
];

/* Split number into the shares */
function split(number, available, needed) {
    var coef = [number, 1, 1], x, exp, c, accum, shares = [];
    /* Normally, we use the line:
     * for(c = 1, coef[0] = number; c < needed; c++) coef[c] = Math.floor(Math.random() * (prime  - 1));
     * where (prime - 1) is the maximum allowable value.
     * However, to follow this example, we hardcode the values:
     * coef = [number, 166, 94];
     * For production, replace the hardcoded value with the random loop
     * For each share that is requested to be available, run through the formula plugging the corresponding coefficient
     * The result is f(x), where x is the byte we are sharing (in the example, 1234)
     */
    for(x = 1; x <= available; x++) {
        /* coef = [1234, 166, 94] which is 1234x^0 + 166x^1 + 94x^2 */
        for(exp = 1, accum = coef[0]; exp < needed; exp++) accum = (accum + (coef[exp] * (Math.pow(x, exp) % prime) % prime)) % prime;
        /* Store values as (1, 132), (2, 66), (3, 188), (4, 241), (5, 225) (6, 140) */
        shares[x - 1] = [x, accum];
    }
    return shares;
}

/* Gives the decomposition of the gcd of a and b.  Returns [x,y,z] such that x = gcd(a,b) and y*a + z*b = x */
function gcdD(a,b) {
    if (b == 0) return [a, 1, 0];
    else {
        var n = Math.floor(a/b), c = a % b, r = gcdD(b,c);
        return [r[0], r[2], r[1]-r[2]*n];
    }
}

/* Gives the multiplicative inverse of k mod prime.  In other words (k * modInverse(k)) % prime = 1 for all prime > k >= 1  */
function modInverse(k) {
    k = k % prime;
    var r = (k < 0) ? -gcdD(prime,-k)[2] : gcdD(prime,k)[2];
    return (prime + r) % prime;
}

/* Join the shares into a number */
function join(shares) {
    var accum, count, formula, startposition, nextposition, value, numerator, denominator;
    for(formula = accum = 0; formula < shares.length; formula++) {
        /* Multiply the numerator across the top and denominators across the bottom to do Lagrange's interpolation
         * Result is x0(2), x1(4), x2(5) -> -4*-5 and (2-4=-2)(2-5=-3), etc for l0, l1, l2...
         */
        for(count = 0, numerator = denominator = 1; count < shares.length; count++) {
            if(formula == count) continue; // If not the same value
            startposition = shares[formula][0];
            nextposition = shares[count][0];
            numerator = (numerator * -nextposition) % prime;
            denominator = (denominator * (startposition - nextposition)) % prime;
        }
        value = shares[formula][1];
        //console.log("value : ",value);
        //console.log("type : ",typeof(value));
        accum = (prime + accum + (value * numerator * modInverse(denominator))) % prime;
    }
    return accum;
}
//generate key pair, will be removed when we can transfer both publicKey & certificate.
  function KeyPairGenerator(length,pub,lam,mu){
    if(typeof length=='undefined'){
      key=bn.generate_paillier_keypair();
    }
    else if(typeof length=="number"&&typeof pub=="string"&&typeof lam=="string"){
      //console.log('offff');
      key=bn.generate_paillier_keypair(length,pub,lam,mu);
    }
    else{
      key=bn.generate_paillier_keypair(length,pub);
    }
  }
function readCreatorPK(){
  key = fs.readFileSync('creator_pk.txt').toString().split("\n");
  //console.log('key : ',key[0]);
  return key[0].toString();
}
//var tskey;
function encryptCoordinates(sh,cipher){
  //console.log(eval(sh[0]));
  //console.log(eval(sh[1]));
  //console.log(eval(sh[2]));
  KeyPairGenerator(1024,pk);
  //KeyPairGenerator();
  //console.log("tskey : ",tskey);
  //console.log("key_n : ",key['public_key'].toJSON()['n']);
  //console.log("key_g : ",key['public_key'].toJSON()['g']);
  //console.log("typeofpk : ",typeof(pk));
  cipher=key['public_key'].raw_encrypt(2,1080);
  //console.log('cipher : ',cipher);
  //var message = key['private_key'].raw_decrypt(cipher);
  //console.log("message : ",message);
}
function readpk_encrypt(m,callback){
  var fs = require("fs"),
    //lineReader = require('line-reader'),
    filename = "creator_pk.txt",
    encode = "utf8";
  var input = fs.createReadStream('creator_pk.txt');
  var remaining = '';
  //read data line-by-line
  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);//remove oher info
      remaining = remaining.substring(index + 1);//remove other info
      //console.log("Line");
      //console.log(line);
      pk = line.substring();
      //Create Server1's public key.
      KeyPairGenerator(1024,pk);
      //Encryt data with Server1's public key.
      //console.log("sh[0]",m);
      cipher=key['public_key'].raw_encrypt(m,1080);//about 32bits, input 40000000000
      //console.log("cipher : "+cipher);
      setTimeout(callback&&callback(cipher.toString()),1000);
      //Write the cipher1 to file.
      fs.appendFile("cipher.txt", /*'cipher1 : '+*/cipher+'\nhash function : sha3-256'+'\n', function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The cipher file was saved!");
      }
      });
      //fs.close();
      //return cipher.toString();

      index = remaining.indexOf('\n');
    }
  });
  input.on('end', function() {
    if (remaining.length > 0) {
      console.log('Line: ' + remaining);
    }
  });
  //console.log("return cipher : ",cipher.toString());

}
function Coordinates_Processing(index) {
/* will modify to this type
  pk = readCreatorPK();
  console.log('pk : ',pk);
  */
  //write shares coordinates
  switch(index){ //read public key and encrypt the (x,y), then write back to 5 data servers.
    //var myContract = web3.eth.contract(abi);
    //var ins = myContract.at('0x2c8a38547db5e3c92d32d8fdD499552c6f1c009f');
    case 0:
    var c0='';
    //encryptCoordinates(sh,cipher);
    readpk_encrypt(eval(sh[0].toString()),function(cipher) {
      var rawbackInfo=ins.gets1();
      //var re = ins.set1("",{from:web3.eth.coinbase,gas: "1000000"});

      //var re = ins.set1(rawbackInfo+" "+pid+" (1,"+cipher+")",{from:web3.eth.coinbase,gas: "1000000"});
      console.log("pid : ",pid);
      //console.log("result1 : "+result);
      //console.log("c0 : ",cipher);
      fs.appendFile("coordinates0.txt",pid+'\n'+sh[0].toString()+'\n'+cipher+'\n',
      function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The coordinates0 file was saved!");
            var position1 = fs.readFileSync('coordinates0.txt').toString().split("\n");
            for(i in position1){
              if(position1[i].length<64){
                position1.splice(i,1);
              }
            }
            // remove original coordinate (x,y) value
            var return_Value='';
            for(i in position1){
              if(i % 2==1){
                position1[i]="(1,"+position1[i]+") ";
              }
              //return_Value = return_Value + position1[i].toString();
            }
            console.log("position1 : ",position1);
            var re = ins.set1(position1.toString(),{from:web3.eth.coinbase,gas: "4700000"});
      }
      });
    });

      break;
    case 1:
    readpk_encrypt(eval(sh[1].toString()),function(cipher) {
      var rawbackInfo=ins.gets2();
      //var re = ins.set2("",{from:web3.eth.coinbase,gas: "1000000"});
      //var re = ins.set2(rawbackInfo+" "+pid+" (2,"+cipher+")",{from:web3.eth.coinbase,gas: "1000000"});

      //console.log("result2 : "+result);
      //console.log("c1 : ",cipher);
      fs.appendFile("coordinates1.txt",pid+'\n'+sh[1].toString()+'\n'+cipher+'\n',
      function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The coordinates1 file was saved!");
            var position2 = fs.readFileSync('coordinates1.txt').toString().split("\n");
            for(i in position2){
              if(position2[i].length<64){
                position2.splice(i,1);
              }
            }
            // remove original coordinate (x,y) value
            var return_Value ='';
            for(i in position2){
              if(i % 2==1){
                position2[i]="(2,"+position2[i]+") ";
              }
              //return_Value = return_Value + position2[i].toString();
            }
            console.log("position2 : ",position2);
            var re = ins.set2(position2.toString(),{from:web3.eth.coinbase,gas: "4700000"});
      }
      });
    });

      break;
    case 2:
    readpk_encrypt(eval(sh[2].toString()),function(cipher) {
      var rawbackInfo=ins.gets3();
      //var re = ins.set3("",{from:web3.eth.coinbase,gas: "1000000"});
      //var re = ins.set3(rawbackInfo+" "+pid+" (3,"+cipher+")",{from:web3.eth.coinbase,gas: "1000000"});

      //console.log("result3 : "+result);
      //console.log("c2 : ",cipher);
      fs.appendFile("coordinates2.txt",pid+'\n'+sh[2].toString()+'\n'+cipher+'\n',
      function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The coordinates2 file was saved!");
            var position3 = fs.readFileSync('coordinates2.txt').toString().split("\n");
            for(i in position3){
              if(position3[i].length<64){
                position3.splice(i,1);
              }
            }
            var return_Value='';
            for(i in position3){
              if(i % 2==1){
                position3[i]="(3,"+position3[i]+") ";
              }
              //return_Value = return_Value + position3[i].toString();
            }
            console.log("position3 : ",position3);
            var re = ins.set3(position3.toString(),{from:web3.eth.coinbase,gas: "4700000"});
      }
      });
    });

      break;
    case 3:
    readpk_encrypt(eval(sh[3].toString()),function(cipher) {
      var rawbackInfo=ins.gets4();
      //var re = ins.set4("",{from:web3.eth.coinbase,gas: "1000000"});
      //var re = ins.set4(rawbackInfo+" "+pid+" (4,"+cipher+")",{from:web3.eth.coinbase,gas: "1000000"});

      //console.log("result4 : "+result);
      //console.log("c3 : ",cipher);
      fs.appendFile("coordinates3.txt",pid+'\n'+sh[3].toString()+'\n'+cipher+'\n',
      function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The coordinates3 file was saved!");
            var position4 = fs.readFileSync('coordinates3.txt').toString().split("\n");
            for(i in position4){
              if(position4[i].length<64){
                position4.splice(i,1);
              }
            }
            var return_Value='';
            for(i in position4){
              if(i % 2==1){
                position4[i]="(4,"+position4[i]+") ";
              }
              //return_Value = return_Value + position4[i].toString();
            }
            console.log("position4 : ",position4);
            var re = ins.set4(position4.toString(),{from:web3.eth.coinbase,gas: "4700000"});
      }
      });
    });


      break;
    case 4:
    readpk_encrypt(eval(sh[4].toString()),function(cipher) {
      var rawbackInfo=ins.gets5();
      //var re = ins.set5("",{from:web3.eth.coinbase,gas: "1000000"});
      //var re = ins.set5(rawbackInfo+" "+pid+" (5,"+cipher+")",{from:web3.eth.coinbase,gas: "1000000"});

      //console.log("result5 : "+result);
      //console.log("c4 : ",cipher);
      fs.appendFile("coordinates4.txt",pid+'\n'+sh[4].toString()+'\n'+cipher+'\n',
      function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The coordinates4 file was saved!");
            var position5 = fs.readFileSync('coordinates4.txt').toString().split("\n");
            for(i in position5){
              if(position5[i].length<64){
                position5.splice(i,1);
              }
            }
            var return_Value='';
            for(i in position5){
              if(i % 2==1){
                position5[i]="(5,"+position5[i]+") ";
              }
              //return_Value = return_Value + position5[i].toString();
            }
            console.log("position5 : ",position5);
            var re = ins.set5(position5.toString(),{from:web3.eth.coinbase,gas: "4700000"});
      }
      });
    });

      break;
  }
}
//test case
function testCase(){
  var g =110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512354480649141036034771883979754626168854682020810561237149462330894866226001834553756911158173549227072099959129140112696067075550461986486461532185998540130;
  var n =110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512354480649141036034771883979754626168854682020810561237149462330894866226001834553756911158173549227072099959129140112696067075550461986486461532185998540129;
  var lamda=110548526384393510720671032490406829567690045142389820268343770556892732268571630984612377978164380803763981217379484986349185648466264866075283105536512333412559546473749739635330718907118997552240688969622774780302839332311472733061609296404062737355936258841543351149695208266100756051815301471056277702676;
  var miu=2910350249977286689560644073014060523591276981811188036027914826827994299258273797487117795031172344923038606215604032135356578673131411356241122138761613178361630119507286654604785857472231323263626091616104774837304411401550414167434164492237420402656485804688617819983185337867575321066008051980210785901;
  //key['public_key'].toJSON()['g'] = g.toString();
  //key['public_key'].toJSON()['n'] = n.toString();
  KeyPairGenerator();
  var cipp = key['public_key'].raw_encrypt(501,1080);
  //console.log("g_mod : "+key['public_key'].toJSON()['g']);
  var message = key['private_key'].raw_decrypt(cipp);

  //console.log("g : "+g);
  //console.log("cipp : "+cipp);
  //console.log("message : "+message);
}

var sh = split(Number(secret), 5, 3) /* split the secret value 129 into 6 components - at least 3 of which will be needed to figure out the secret value */
//var newshares1 = [sh[0], sh[1], sh[2]]; /* pick any selection of 3 shared keys from sh */
var newshares2 = [sh[0],sh[1],sh[2]]; /* pick any selection of 3 shared keys from sh */
var newshares3 = [sh[0],sh[1],sh[3]]; /* pick any selection of 3 shared keys from sh */
var newshares4 = [sh[1],sh[3],sh[4]]; /* pick any selection of 3 shared keys from sh */

var key;
var pk='';
var cipher='';
/*console.log("sh[0] : ",sh[0],' type : ',typeof(sh[0]));
console.log("sh[1] : ",sh[1],' type : ',typeof(sh[1]));
console.log("sh[2] : ",sh[2],' type : ',typeof(sh[2]));
console.log("sh[3] : ",sh[3],' type : ',typeof(sh[3]));
console.log("sh[4] : ",sh[4],' type : ',typeof(sh[4]));*/
//console.log("eval(sh[0]) : ",eval(sh[0].toString()),' type : ',typeof(eval(sh[0].toString())));
for(i=0;i<5;i++){
  setTimeout(Coordinates_Processing(i),2000);
}

var myContract = web3.eth.contract(abi);
var ins = myContract.at('0x2c8a38547db5e3c92d32d8fdD499552c6f1c009f');
//testCase();
//readpk_encrypt();
