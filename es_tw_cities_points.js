var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    hosts: 'localhost:9200',
    requestTimeout: Infinity
});

let inputFile = require('./tw_cities.json');
let indexName = 'tw_cities_points';
let indexType = 'cities';

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
                "name": {
                    "type": "text"
                },
                "type": {
                    "type": "text"
                },
                "location": {
                    "type": "geo_point"
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
    let j = 1;

    for (let i in input) {
        bulkArr.push({
            index: {
                _index: indexName,
                _type: indexType,
                _id: j++
            }
        }, {
            'name': input[i].properties.name,
            'type': input[i].properties.type,
            'location': input[i].geometry.coordinates
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
