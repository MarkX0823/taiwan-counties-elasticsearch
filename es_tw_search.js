var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: 'localhost:9200',
    requestTimeout: Infinity
});

indexed_shape();

function indexed_shape() {
    client.search({
        index: "tw_cities_shapes",
        size: 100,
        body: {
            "query":{
                "bool": {
                    "filter": {
                        "geo_shape": {
                            "location": {
                                // "relation": "disjoint",
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
    }, (err, resp, status) => {
        if (err) throw err;
        console.log(JSON.stringify(resp, undefined, 2));
    });
}

function geo_shape() {
    client.search({
        index: "tw_cities_shapes",
        size: 100,
        body: {
            "query":{
                "bool": {
                    "must": {
                        "match_all": {}
                    },
                    "filter": {
                        "geo_shape": {
                            "location": {
                                "shape": {
                                    "type": "envelope",
                                    "coordinates" : [[121.532965, 25.038035], [121.563569, 25.010418]]
                                },
                                "relation": "within"
                            }
                        }
                    }
                }
            }
        }
    }, (err, resp, status) => {
        if (err) throw err;
        console.log(JSON.stringify(resp, undefined, 2));
    });
}

function geo_bounding_box() {
    client.search({
        index: "tw_cities_points",
        size: 100,
        body: {
            "query": {
                "bool": {
                    "must": {
                        "match_all": {}
                    },
                    "filter": {
                        "geo_bounding_box": {
                            "location": {
                                "top_left": {
                                    "lat": 25.038035,
                                    "lon": 121.532965
                                },
                                "bottom_right": {
                                    "lat": 25.010418,
                                    "lon": 121.563569
                                }
                            }
                        }
                    }
                }
            }
        }
    }, (err, resp, status) => {
        if (err) throw err;
        console.log(JSON.stringify(resp, undefined, 2));
    });
}

function geo_polygon() {
    client.search({
        index: "tw_cities_points",
        size: 100,
        body: {
            "query": {
                "bool": {
                    "must": {
                        "match_all": {}
                    },
                    "filter": {
                        "geo_polygon": {
                            "location": {
                                "points": [
                                    [121.570696, 25.050848],
                                    [121.549874, 25.071898],
                                    [121.509058, 25.063740],
                                    [121.505768, 25.048803],
                                    [121.516465, 25.021966],
                                    [121.551429, 25.001251]
                                ]
                            }
                        }
                    }
                }
            }
        }
    }, (err, resp, status) => {
        if (err) throw err;
        console.log(JSON.stringify(resp, undefined, 2));
    });
}

function geo_distance() {
    client.search({
        index: "tw_cities_points",
        size: 100,
        body: {
            "query": {
                "bool": {
                    "must": {
                        "match_all": {}
                    },
                    "filter": {
                        "geo_distance": {
                            "distance": "1km",
                            "location": [121.564742, 25.034048] // Taipei 101
                        }
                    }
                }
            }
        }
    }, (err, resp, status) => {
        if (err) throw err;
        console.log(JSON.stringify(resp, undefined, 2));
    });
}
