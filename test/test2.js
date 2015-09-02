import Conf from './Conf'
import path from 'path'


//console.log(new Conf('t1'));
let config = Conf.parse(path.join(__dirname, 'config.json'));

for (let [k, v] of config.entries()){
    if (typeof v === 'Object') v = JSON.stringify(v);
    console.log(`k: ${k}, v: ${v}`);
}

console.log(config.version)

class B {
    get html(){
        return '<HTML/>'
    }

    html2(){
        return '<BODY/>';
    }

    get(key){
        return '<GET/>';
    }
}

let b = new B();
console.log(b.html);
console.log(b.html2());
//console.log(b['aaa']]);
console.log(b.get());

class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
console.log(arr.length); // 1

arr.length = 0;
console.log(arr[0]); // undefined
