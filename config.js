'use strict';

var fs = require('fs');
var confidence = require('confidence');

var env = process.env.NODE_ENV;
var localConfig = {};
if(env !== 'production' && fs.existsSync('config.local.js')) {
    localConfig = require('./config.local');
}

function rabbitToAmqp(url) {
    return url ? url.replace('rabbitmq://', 'amqp://') : null;
}

var store = new confidence.Store({
    db: {
        $filter: 'env',
        production: {
            mongo: {
                url: process.env.MONGO_URL
            }
        },
        $default: {
            mongo: {
                url: localConfig.mongoUrl
            }
        }
    },
    storage: {
        $filter: 'env',
        production: {
            aws: {
                key: process.env.AWS_KEY,
                secret: process.env.AWS_SECRET
            }
        },
        $default: {
            aws: {
                key: localConfig.awsKey,
                secret: localConfig.awsSecret
            }
        }
    },
    queues: {
        $filter: 'env',
        production: {
            rabbit: {
                url: rabbitToAmqp(process.env.RABBITMQ_URL)
            }
        },
        $default: {
            rabbit: {
                url: localConfig.rabbitUrl
            }
        }
    },
    logging: {
        $filter: 'env',
        production: {
            debug: false
        },
        $default: {
            debug: true
        }
    }
});

var criteria = {
    env: env
};

exports.get = function(key) {
    return store.get(key, criteria);
};
