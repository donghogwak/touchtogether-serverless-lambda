import { success, failure } from '../../lib/response-lib';

const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

module.exports.user = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    let eventParams = JSON.parse(event.body);
    switch (operation) {
        case 'POST':
            /*
            params :
                accesstoken : 
            */
            params = {
                AccessToken: eventParams.accesstoken
            };
            cognitoidentityserviceprovider.getUser(params, function(err, data){
                if (err) {
                    callback(null, failure(JSON.stringify(err)));
                }
                else {
                    callback(null, success(JSON.stringify(data)));
                }
            });
            break;
        case 'PUT':
            /*
            path: 
            params: {
                clientid: ,
                username: ,
                email: "",
                name: ""
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
                    callback(null, failure(JSON.stringify(err)));
                }
                cognitoidentityserviceprovider.changePassword(params, function(err, data){
                    if (err) {
                        callback(null, failure(JSON.stringify(err)));
                    }
                    else {
                        callback(null, success(JSON.stringify(data)));
                    }
                });
            }
            else if (eventParams.requestkey == 1) {
                try {
                    params = {
                        AccessToken: eventParams.accesstoken,
                        UserAttributes: JSON.parse(eventParams.userattributes)
                        /*[ {
                            Name: 'STRING_VALUE',
                            Value: 'STRING_VALUE'
                        },],*/
                    };
                } catch(err) {
                    callback(null, failure(JSON.stringify(err)));
                }
                cognitoidentityserviceprovider.changePassword(params, function(err, data){
                    if (err) {
                        callback(null, failure(JSON.stringify(err)));
                    }
                    else {
                        callback(null, success(JSON.stringify(data)));
                    }
                });
            }
            break;
    }
};
