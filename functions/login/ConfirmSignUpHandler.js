import { success, failure } from '../../lib/response-lib';

const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.confirmsignup = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    let eventParams = event.body;
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
            try {
                params = {
                    ClientId: eventParams.clientid,
                    ConfirmationCode: eventParams.confirmationcode,
                    Username: eventParams.username
                };
            } catch(err) {
                callback(null, failure(err));
            }
            cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
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
