var fs = require('fs');
var Web3 = require('web3');
var Cryptr=require('cryptr');
var bn = require('/Users/peter087744982/Desktop/homomorphicjs');
var jsbn = require('/Users/peter087744982/node_modules/jsbn');
var sha3_256 = require("js-sha3").sha3_256;
var prime = 257;

/* Gives the multiplicative inverse of k mod prime.  In other words (k * modInverse(k)) % prime = 1 for all prime > k >= 1  */
function modInverse(k) {
    k = k % prime;
    var r = (k < 0) ? -gcdD(prime,-k)[2] : gcdD(prime,k)[2];
    return (prime + r) % prime;
}
/* Gives the decomposition of the gcd of a and b.  Returns [x,y,z] such that x = gcd(a,b) and y*a + z*b = x */
function gcdD(a,b) {
    if (b == 0) return [a, 1, 0];
    else {
        var n = Math.floor(a/b);

        var c = a % b;
        var r = gcdD(b,c);
        return [r[0], r[2], r[1]-r[2]*n];
    }
}
/* Join the shares into a number */
function join(shares) {
  //console.log("shares : ".shares);
  shares=[eval(shares[0]),eval(shares[1]),eval(shares[2])];

    var accum, count, formula, startposition, nextposition, value, numerator, denominator;
    for(formula = accum = 0; formula < shares.length; formula++) {
        /* Multiply the numerator across the top and denominators across the bottom to do Lagrange's interpolation
         * Result is x0(2), x1(4), x2(5) -> -4*-5 and (2-4=-2)(2-5=-3), etc for l0, l1, l2...
         */
        for(count = 0, numerator = denominator = 1; count < shares.length; count++) {
            if(formula == count) continue; // If not the same value
            //1213,2123,3132
            startposition = formula+1;
            //console.log("startposition : ",startposition,typeof(startposition));
            nextposition = count+1;
            //console.log("nextposition : ",nextposition,typeof(nextposition));
            numerator = (numerator * -nextposition) % prime;
            denominator = (denominator * (startposition - nextposition)) % prime;
        }
        value = shares[formula];
        accum = (prime + accum + (value * numerator * modInverse(denominator))) % prime;
    }
    return accum;
}

//read coordinates(x,y) from data file.
var array0 = fs.readFileSync('coordinates0.txt').toString().split("\n");
var array1 = fs.readFileSync('coordinates1.txt').toString().split("\n");
var array2 = fs.readFileSync('coordinates2.txt').toString().split("\n");
var array3 = fs.readFileSync('coordinates3.txt').toString().split("\n");
var array4 = fs.readFileSync('coordinates4.txt').toString().split("\n");
var index=array0.indexOf()+1;

//remove pid
for(i in array0){
  if(array0[i].length==64){
    array0.splice(i,1);
    array1.splice(i,1);
    array2.splice(i,1);
    array3.splice(i,1);
    array4.splice(i,1);
  }
}
//remove remain coordinates(x,y)
for(i in array0){
  if(array0[i].length>64){
    array0.splice(i,1);
    array1.splice(i,1);
    array2.splice(i,1);
    array3.splice(i,1);
    array4.splice(i,1);
  }
}
//remove null data
for(i in array0){
  if(array0[i].length==0){
    array0.splice(i,1);
    array1.splice(i,1);
    array2.splice(i,1);
    array3.splice(i,1);
    array4.splice(i,1);
  }
}
function printCoordinates(){
  console.log('array0 : '+'\n');
  for(i in array0){
    console.log(array0[i]);
  }
  console.log('array1 : '+'\n');
  for(i in array1){
    console.log(array1[i]);
  }
  console.log('array2 : '+'\n');
  for(i in array2){
    console.log(array2[i]);
  }
  console.log('array3 : '+'\n');
  for(i in array3){
    console.log(array3[i]);
  }
  console.log('array4 : '+'\n');
  for(i in array4){
    console.log(array4[i]);
  }
}
printCoordinates();
//recover original secret with 3 coordinates from 5 severs randomly.
var result;
var counter=1;
var element = array0.length-1;
for(i in array0){
  result=[array0[i],array1[i],array2[i]];
  console.log("Voter",counter+". ",join(result));
  counter = counter +1;
}
//write the result into smart contract.
/*
//recover original secret with 3 coordinates from 5 severs randomly.
var newshares1=[(array0[0]),(array1[0]),(array2[0])];
var newshares2=[(array0[1]),(array1[1]),(array2[1])];
var newshares3=[(array0[2]),(array1[2]),(array2[2])];
var newshares4=[(array0[3]),(array1[3]),(array2[3])];
//show off the original voting number.
console.log(join(newshares1));
console.log(join(newshares2));
console.log(join(newshares3));
console.log(join(newshares4));*/
