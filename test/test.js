var a = 5;
var b = 10;

let s = Symbol('t');
console.log(`symbol:${s.toString()}`);

function tag(s, v1, v2) {
  console.log(s[0]);
  console.log(s[1]);
  console.log(s[2]);
  console.log(v1);
  console.log(v2);

  return "OK";
}

tag`Hello ${ a + b } world ${ a * b}`;
// "Hello "
// " world "
// ""
// 15
// 50
// "OK"

let aa1 = [1, 2, 3, 4];
//let aa2 = [for (i of aa1) i * 2];
//console.log(a2);

let f1 = ((a, b) => {
    a++; b++;
    let c = a + b;
    return c;
});

let s1 = 'get single instance of object';
if (s1.startsWith('get')) {
    console.log('got');
}


console.log(f1(2, 3));

function ts(s1, args){
    console.log(`aa ${args} bb.`);
}

ts`Test f1 result: ${a} good idea`
console.log(`Test f1 result: ${f1(2, 4)} good idea`);

function restTest(s1, ...v1) {
    if (v1.length > 0) console.log(`v1[0]: ${v1[0]}`)
    if (v1.length > 1) console.log(`v1[1]: ${v1[1]}`)
    if (v1.length > 2) console.log(`v1[2]: ${v1[2]}`)
    if (v1.length > 3) console.log(`v1[3]: ${v1[3]}`)
}

restTest('tt', 't1', 2, 'good', 0.343);
console.log('test again');
restTest('tt', 't1', 2);

let a1 = [1, 2, 3, 4, 5, 5, 6, 2];
console.log(a1);

let a2 = Array.from(new Set(a1));
console.log(a2);

var [k1, k2, k3] = a1;
console.log(k2);
let d1 = {k1:"v1", k2:"v2", k3:"v3"};
let d2 = {"k1":"v1", "k2":"v2", "k3":"v3"};

let m1 = new Map()
    .set("k1", "v1")
    .set("k2", "v2")
    .set("k3", "v3");

for (let k in d2.keys) {
    console.log('k: ' + k);
        //console.log(k + ': ' + v);
}

for (let [k, v] of m1) {
    console.log(k + ' => ' + v);
}

for(let [k, ] of m1) {
    console.log(`k: [${k}]`);
}

let f2 = ((a, b) => {
    a++; b++;
    console.log(a+b);
});

f2(2, 3)
