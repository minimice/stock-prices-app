'use strict';

const SQS = require('../infrastructure/sqs');

const sqsClient = new SQS({
    QueueUrl: process.env.QUEUEURL || 'http://localhost:9324/queue/testqueue'
});

module.exports = {
    deleteMessage: sqsClient.deleteMessage,
    receiveSingleMessage: sqsClient.receiveSingleMessage,
};
