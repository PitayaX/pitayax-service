{
    "type": "report",
    "version":"1.0.0",
    "arguments": {
    },
    "script": {
        "$query":{},
        "$fields":{"_id":0, "tags":1}
    },
    "postedScript": function(data){
        return data;    // data[0]['tags'][0];
    }
};
