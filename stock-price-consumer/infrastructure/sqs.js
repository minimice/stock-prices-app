'use strict';

const service = require('superagent');
const AWS = require('aws-sdk');

const AWSSQS = new AWS.SQS({
  apiVersion: '2012-11-05',
  region: 'eu-west-1'
});

const defaultParams = {
  AttributeNames: ['All'],
  MessageAttributeNames: ['All'],
  WaitTimeSeconds: process.env.QUEUEWAITTIMESECONDS || 20,
};

function SQS(options) {
  function _mapEncodedSqsMessage(sqsMsg) {
    const decoded = JSON.parse(sqsMsg.Body);
    decoded.Message = JSON.parse(decoded.Message);

    return {
      subject: decoded.Subject || decoded.TopicArn.split(':').pop(),
      body: decoded.Message,
      receiptHandle: sqsMsg.ReceiptHandle,
    };
  }
  return {
    purge() {
      return new Promise((resolve, reject) => {
        AWSSQS.purgeQueue({
            QueueUrl: options.QueueUrl
          }, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      });
    },
    pushAndWait(subject, message) {
      return new Promise((resolve, reject) => {
        service.get(options.QueueUrl + '?Action=SendMessage&MessageBody=' + JSON.stringify({
            Subject: subject,
            Message: JSON.stringify(message)
          }))
          .end(function (error, response) {
            if (error) {
              reject(error);
            } else {
              setTimeout(() => resolve(response), 0 /*1000*/ ); // wait for queue to process the event
            }
          })
      });
    },
    deleteMessage(receiptHandle) {
      return new Promise((resolve, reject) => {
        AWSSQS.deleteMessage({
          QueueUrl: options.QueueUrl,
          ReceiptHandle: receiptHandle
        }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    },
    receiveSingleMessage() {
      const params = Object.assign({}, defaultParams, options, {
        MaxNumberOfMessages: 1
      });
      return new Promise((resolve, reject) => {
        AWSSQS.receiveMessage(params, (err, data) => {
          if (err) {
            reject(err);
          } else if (data && data.Messages instanceof Array && data.Messages.length > 0) {
            const messages = data.Messages.map(_mapEncodedSqsMessage);
            resolve(messages[0]); // MaxNumberOfMessages was 1
          } else {
            resolve();
          }
        });
      });
    },
    readAll() {
      const params = Object.assign({}, options, {
        WaitTimeSeconds: 0,
        MaxNumberOfMessages: 5
      });
      return new Promise((resolve, reject) => {
        AWSSQS.receiveMessage(params, (err, data) => {
          if (err) {
            reject(err);
          } else if (data && data.Messages instanceof Array && data.Messages.length > 0) {
            resolve(data.Messages.map(_mapEncodedSqsMessage));
          } else {
            resolve();
          }
        });
      });
    },
  };
}

module.exports = SQS;