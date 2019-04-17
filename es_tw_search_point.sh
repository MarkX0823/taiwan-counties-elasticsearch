curl -X GET "localhost:9200/tw_cities_points/_search?pretty&size=20" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must": {
        "match_all": {}
      },
      "filter": {
        "geo_distance": {
          "distance": "5km",
          "location": [121.564742, 25.034048] // Taipei 101
          }
        }
      }
    }
  }
}
'
