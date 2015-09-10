"use strict";

class ConfigMap extends Map {
    constructor(){
        super()
    }
}

module.exports = function() {

    global.ConfigMap = ConfigMap;
    //test: ()=>{console.log('a');}
    //'test': function(){console.log('tt');}
    return {
        test: (()=>'good'),

        ConfigMap: ConfigMap
    }
}();
