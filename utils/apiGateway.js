const AWS = require('aws-sdk');

module.exports.send = (event, connectionId) => {
    const body = JSON.parse(event.body);
    const postData = body.data;  

    const endpoint = event.requestContext.domainName + "/" + event.requestContext.stage;

    const apigwManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: "2018-11-29",
        endpoint: endpoint
    });

    const params = {
        ConnectionId: connectionId,
        Data: postData
    };

    return apigwManagementApi.postToConnection(params).promise();
};