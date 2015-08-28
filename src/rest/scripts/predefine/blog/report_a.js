var $$ = {
        "type":"report",
        "version":"1.0.0",
        "arguments": {
            "$$tags": {"default":["Perforce","Product"], "type":"string"}
        },

        "script":{
            "$query":{"tags":{"$in": "$$tags"}},
            "$fields":{"_id":0, "title":1, "tags":1, "lastUpdateDate":1, "date":1},
            "$orderby": {
                "lastUpdateDate": 1
            }
        }
    };
