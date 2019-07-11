const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.getConnectionIds = (table, attribute) => {  
    const params = {
      TableName: table,
      ProjectionExpression: attribute,
    };
  
    return dynamo.scan(params).promise();
};

module.exports.addConnection = (table, item) => {
  const params = {
    TableName: table,
    Item: item,
  };

  return dynamo.put(params).promise();
};

module.exports.deleteConnection = (table, item) => {
  const params = {
    TableName: table,
    Key: item,
  };

  return dynamo.delete(params).promise();
};