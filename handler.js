'use strict';
const dynamoDBUtils = require('./utils/dynamoDB');
const apiGatewayUtils  = require('./utils/apiGateway');

const CHATCONNECTION_TABLE = 'chatIdTable';

const successfullResponse = {
  statusCode: 200,
  body: 'everything is alright'
};

module.exports.connectionHandler = async (event, context, callback) => {
  console.log(event);

  if (event.requestContext.eventType === 'CONNECT') {
    try {
        // Handle connection
        await dynamoDBUtils.addConnection(CHATCONNECTION_TABLE, { connectionId: event.requestContext.connectionId });
        callback(null, successfullResponse);
    } catch(err) {
        console.log(err);
        callback(null, JSON.stringify(err));
    }
  } else if (event.requestContext.eventType === 'DISCONNECT') {
    try {
        // Handle disconnection
        await dynamoDBUtils.deleteConnection(CHATCONNECTION_TABLE, { connectionId: event.requestContext.connectionId });
        callback(null, successfullResponse);
    } catch(err) {
        console.log(err);
        callback(null, {
            statusCode: 500,
            body: 'Failed to connect: ' + JSON.stringify(err)
        });        
    }
  }
};

module.exports.defaultHandler = (event, context, callback) => {
  console.log('defaultHandler was called');
  console.log(event);

  callback(null, {
    statusCode: 200,
    body: 'defaultHandler'
  });
};

module.exports.sendMessageHandler = async (event, context, callback) => {
    try {
        await sendMessageToAllConnected(event);
        callback(null, successfullResponse);
    } catch(err) {
        callback(null, JSON.stringify(err));
    }
}

const sendMessageToAllConnected = (event) => {
  return dynamoDBUtils.getConnectionIds(CHATCONNECTION_TABLE, 'connectionId').then(connectionData => {
    return connectionData.Items.map(connectionId => {
      return apiGatewayUtils.send(event, connectionId.connectionId);
    });
  });
}