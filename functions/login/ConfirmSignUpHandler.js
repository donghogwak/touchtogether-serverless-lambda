const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

module.exports.confirmsignup = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    const response = {
        statusCode: 200,
        headers: {
        },
        body: JSON.stringify(event.body),
        isBase64Encoded: false
    };
    const eventParams = JSON.parse(event.body);
    switch (operation) {
        case 'POST':
            /*
            path: /touchtogetherConfirmSignUpProto
            params: {
                clientid: "",
                confirmationcode: "",
                username: "",
            }
            */
            
            params = {
                ClientId: eventParams.clientid,
                ConfirmationCode: eventParams.confirmationcode,
                Username: eventParams.username
            };
            
            cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
                if (err) {
                    response.statusCode = 502;
                    response.body = JSON.stringify(err);
                    callback(null, response);
                }
                else {
                    response.body = JSON.stringify(data);
                    callback(null, response);
                }
            });
            break;
        default:
            callback(new Error('Error: "${operation)"'));
    }
};
