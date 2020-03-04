
const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

module.exports.group = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    let eventParams = JSON.parse(event.body);
    switch (operation) {
        case 'GET':
            /*
                //get a group
                params = {
                    UserPoolId: process.env.UserPoolId,
                    GroupName: eventParams.groupname
                }
                cognitoidentityserviceprovider.getGroup(params, function(err, data){
                    if (err) {
                        callback(null, failure(JSON.stringify(err));
                    }
                    else {
                        callback(null, success(JSON.stringify(data));
                    }
                });
            */
            eventParams = JSON.parse(event.queryStringParameters)
            if (eventParams.nexttoken) {
                params = {
                    UserPoolId: process.env.UserPoolId,
                    NextToken: eventParams.nexttoken
                    Limit: eventParams.limit ? eventParams : 10
                };
                cognitoidentityserviceprovider.listUsers(params, function(err, data){
                    if (err) {
                        callback(null, failure(JSON.stringify(err));
                    }
                    else {
                        callback(null, success(JSON.stringify(data));
                    }
                });
            }
            else {
                params = {
                    UserPoolId: process.env.UserPoolId,
                    Limit: eventParams.limit ? eventParams : 10
                };
                cognitoidentityserviceprovider.listUsers(params, function(err, data){
                    if (err) {
                        callback(null, failure(JSON.stringify(err));
                    }
                    else {
                        callback(null, success(JSON.stringify(data));
                    }
                });
            }
            break;
        case 'POST':
            /*
            path: 
            params: {
                groupname: ,
                description: ,
                precedence: "",
                polearn: ""
            }
            */
            try {
                params = {
                    UserPoolId: process.env.UserPoolId,
                    GroupName: eventParams.groupname,
                    Description: eventParams.description ? eventParams.description : '',
                    Precedence: eventParams.precedence ? eventParams.precedence : null,
                    RoleArn: eventParams.rolearn ? eventParams.rolearn : ''
                };
            } catch(err) {
                callback(null, failure(JSON.stringify(err));
            }
            cognitoidentityserviceprovider.adminCreateUser(params, function(err, data){
                if (err) {
                    callback(null, failure(JSON.stringify(err));
                }
                else {
                    callback(null, success(JSON.stringify(data));
                }
            });
            break;
        case 'PUT':
            /*
            path: 
            params: {
                groupname: ,
                description: ,
                precedence: "",
                polearn: ""
            }
            */
            try {
                params = {
                    GroupName: eventParams.groupname,
                    UserPoolId: process.env.UserPoolId
                    Description: eventParams.description ? eventParams.description : '',
                    Precedence: eventParams.precedence ? eventParams.precedence : null,
                    RoleArn: eventParams.rolearn ? eventParams.rolearn : ''
                };
            } catch(err) {
                callback(null, failure(JSON.stringify(err));
            }
            cognitoidentityserviceprovider.updateGroup(params, function(err, data){
                if (err) {
                    callback(null, failure(JSON.stringify(err));
                }
                else {
                    callback(null, success(JSON.stringify(data));
                }
            });
            break;
        case 'DELETE':
            /*
            path: 
            params: {
                groupname: ,
            }
            */
            try {
                params = {
                    GroupName: eventParams.groupname,
                    UserPoolId: process.env.UserPoolId
                };
            } catch(err) {
                callback(null, failure(JSON.stringify(err));
            }
            cognitoidentityserviceprovider.deleteGroup(params, function(err, data){
                if (err) {
                    callback(null, failure(JSON.stringify(err));
                }
                else {
                    callback(null, success(JSON.stringify(data));
                }
            });
            break;
        default:
            callback(new Error('Error: "${operation)"'));
    }
};
