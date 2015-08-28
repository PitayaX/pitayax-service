/**
 * Created by Bruce on 8/20/2015.
 */
var $$ = {
    "type": "aggregate",
    "version": "1.0.0",
    "arguments": {
        "$$years": {"default":[2014, 2015], "type":"int"}
    },
    "script": [
            {
                "$project": {
                    "dt": {
                        "$add": [new Date(0), "$startDate"]
                    }
                }
            },
            {
                "$project": {
                    "year": {"$year": "$dt"},
                    "month": {"$month": "$dt"}
                }
            },
            {
                "$match": {
                    "year": {"$in": "$$years"}
                    }
            },
            {
                "$group": {
                "_id": {
                    "year": "$year",
                        "month": "$month"
                },
                "count": {"$sum": 1}
            }
            },
            {
                "$sort": {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]
};