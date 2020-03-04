import { success, failure } from '../../lib/response-lib';

const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.login = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    let eventParams = JSON.parse(event.body);
    switch (operation) {
        case 'POST':
            /*
            path: /loginTestFunc
            params: {
                "authflow":"",
                "clientid":"",
                "username":"",
                "password":""
            }
            */
            try {
                params = {
                    AuthFlow: eventParams.authflow,
                    ClientId: eventParams.clientid,
                    AuthParameters: {
                        USERNAME: eventParams.username,
                        PASSWORD: eventParams.password
                    }
                };
            } catch(err) {
                callback(null, failure(err));
            }
            cognitoidentityserviceprovider.initiateAuth(params, function(err, data){
                if (err) {
                    callback(null, failure(err));
                }
                else {
                    callback(null, success(data));
                }
            });
            break;
        default:
            callback(new Error('Error: "${operation)"'));
    }
};
