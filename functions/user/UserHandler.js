import { success, failure } from '../../lib/response-lib';

const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.user = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    let eventParams = JSON.parse(event.body);
    switch (operation) {
        case 'POST':
            /*
            params :
                accesstoken : ""
            */
            params = {
                AccessToken: eventParams.accesstoken
            };
            cognitoidentityserviceprovider.getUser(params, function(err, data){
                if (err) {
                    callback(null, failure(err));
                }
                else {
                    callback(null, success(data));
                }
            });
            break;
        case 'PUT':
            /*
            path:
            params: {
                accesstoken: ""
            }
            */
            if (eventParams.requestkey == 0) {
                try {
                    params = {
                        AccessToken: eventParams.accesstoken,
                        PreviousPassword: eventParams.previouspassword,
                        ProposedPassword: eventParams.proposedpassword
                    };
                } catch(err) {
                    callback(null, failure(err));
                }
                cognitoidentityserviceprovider.changePassword(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 1) {
                try {
                    params = {
                        AccessToken: eventParams.accesstoken,
                        UserAttributes: [{
                            Name: "email",
                            Value: eventParams.email
                        },{
                            Name: "name",
                            Value: eventParams.name
                        }]
                    };
                } catch(err) {
                    callback(null, failure(err));
                }
                cognitoidentityserviceprovider.updateUserAttributes(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            break;
    }
};
