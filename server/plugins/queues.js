'use strict';

let amqp = require('amqp');
let config = require('../../config').get('/queues');

exports.register = function(server, options, next) {
    const connection = amqp.createConnection({
        url: config.rabbit.url
    });

    connection.on('ready', function () {
        const exchange = connection.exchange('tag.updates', {
            durable: true,
            autoDelete: false
        });

        exchange.on('open', function () {
            server.decorate('reply', 'publishTagUpdates', function (tags) {
                exchange.publish(tags);
            });

            next();
        });
    });
};

exports.register.attributes = {
    name: '27thvfw.queues',
    version: '1.0.0'
};
