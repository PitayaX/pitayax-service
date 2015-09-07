{
    "type": "report",
    "version": "1.0.0",
    "script": {
        "$query": {"City": {"$regex":"^(A|B|C).*"}},
        "$fields": {"_id": 0, "City": 1, "Fax": 1, "ContactName": 1},
        "$orderby": {
            "City": 1
        }
    }
};
