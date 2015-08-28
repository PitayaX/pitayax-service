var $$ = {
    "type":"report",
    "version":"1.0.0",
    "script":{
        "$query": {
            "name": {
                "$regex": "$$name"
            },
            "clientId": {
                "$regex": "^301.*"
            }
        },
        "$orderby": {
            "name": 1
        }
    }
};