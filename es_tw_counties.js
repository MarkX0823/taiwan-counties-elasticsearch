var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: 'localhost:9200',
    requestTimeout: Infinity
});

let inputFile = require('./tw_counties.json');
let indexName = 'tw_counties';
let indexType = 'county';

start();

function start() {
    client.indices.exists({
        index: indexName
    }, (err, resp, status) => {
        if (err) throw err;
        console.log("exists", resp);
        if (resp) {
            deleteIndex();
        } else {
            createIndex();
        }
    });
}

function deleteIndex() {
    client.indices.delete({
        index: indexName,
    }, (err, resp, status) => {
        if (err) throw err;
        console.log("deleteIndex", resp);
        createIndex();
    });
}

function createIndex() {
    client.indices.create({
        index: indexName,
    }, (err, resp, status) => {
        if (err) throw err;
        console.log("createIndex", resp);
        putMapping();
    });
}

function putMapping() {
    client.indices.putMapping({
        index: indexName,
        type: indexType,
        body: {
            "properties": {
                "COUNTYNAME": {
                    "type": "keyword"
                },
                "COUNTYID": {
                    "type": "keyword"
                },
                "COUNTYCODE": {
                    "type": "keyword"
                },
                "COUNTYENG": {
                    "type": "keyword"
                },
                "location": {
                    "type": "geo_shape"
                }
            }
        }
    }, (err, resp, status) => {
        if (err) throw err;
        console.log("putMapping", resp);
        makeBulk(inputFile);
    });
}

function makeBulk(input) {
    let bulkArr = [];

    for (let i in input) {
        bulkArr.push({
            index: {
                _index: indexName,
                _type: indexType,
                _id: input[i].properties.COUNTYNAME
            }
        }, {
            'COUNTYNAME': input[i].properties.COUNTYNAME,
            'COUNTYID': input[i].properties.COUNTYID,
            'COUNTYCODE': input[i].properties.COUNTYCODE,
            'COUNTYENG': input[i].properties.COUNTYENG,
            'location': input[i].geometry
        });
    }
    
    indexAll(bulkArr);
}

function indexAll(bulkDocs) {
    client.bulk({
        index: indexName,
        type: indexType,
        body: bulkDocs
    }, (err, resp, status) => {
        if (err) throw err;
        console.log("indexAll", resp.items);
    });
}
