
console.log('start');

if (1 === 1) {
    const b = 'test';
    console.log(b);
}

(a, b) => {
    console.log(a + b);
}(2, 3);

for (const i of [ 1, 2, 3, 4 ]) {
    console.log(i);
}

[ 1, 2, 3, 4 ].forEach( function (item, index) {
    console.log(index);
})

const dic = { "k1": "v1", "k2": "v2" };

console.log(Object.keys(dic));
console.log(Object.getPrototypeOf(dic));

const a = function () {
    return function (s) {
        console.log(s);
    }
}

a()('t');


console.log('end');
