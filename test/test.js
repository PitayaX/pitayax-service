let a = 1;

console.log(a);

let f1 = (a, b) => {
    a++; b++;
    let c = a + b;
    return c;
}

console.log(f1(2, 3));

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

console.log(d1);
//console.log(d1[2]);

for ([k, v] in d1) {
        //console.log(k + ': ' + v);
}

for (let k in d2.keys) {
    console.log('k: ' + k);
        //console.log(k + ': ' + v);
}

for (let [k, v] of m1) {
    //console.log('k: ' + k);
    console.log(k + ' => ' + v);
}

let fn1 = ((a, b) => {
    a++; b++;
    console.log(a+b);
});

fn1(2, 3)
