curl -X GET "localhost:9200/tw_cities_shapes/_search?pretty&size=20" -H 'Content-Type: application/json' -d'
{
    "query": {
        "bool": {
            "filter": {
                "geo_shape": {
                    "location": {
                        "indexed_shape": {
                            "index": "tw_counties",
                            "type": "county",
                            "id": "臺北市",
                            "path": "location"
                        }
                    }
                }
            }
        }
    }
}
'
