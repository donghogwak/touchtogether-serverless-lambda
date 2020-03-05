import { success, failure } from '../../lib/response-lib';

const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.mgmtuser = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    let eventParams = JSON.parse(event.body);
    switch (operation) {
        case 'GET':
            /*
                //get a user
                params : {
                    nexttoken : "",
                    limit : "required : no",
                    groupname : "required : no"
                }
                params = {
                    UserPoolId: process.env.UserPoolId,
                    Username: eventParams.username
                }
                cognitoidentityserviceprovider.adminGetUser(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            */
            let listKey = 0;
            eventParams = event.queryStringParameters;
            if (eventParams.nexttoken) {
                try {
                    params = {
                        UserPoolId: process.env.UserPoolId,
                        PaginationToken: eventParams.nexttoken,
                        Limit: eventParams.limit ? Number(eventParams.limit) : 10
                    };
                    if (eventParams.groupname) {
                        params.GroupName = eventParams.groupname;
                        listKey = 1;
                    }
                } catch(err) {
                    callback(null, failure(err));
                }
                if (listKey) {
                    cognitoidentityserviceprovider.listUsersInGroup(params, function(err, data){
                        if (err) {
                            callback(null, failure(err));
                        }
                        else {
                            callback(null, success(data));
                        }
                    });
                } else {
                    cognitoidentityserviceprovider.listUsers(params, function(err, data){
                        if (err) {
                            callback(null, failure(err));
                        }
                        else {
                            callback(null, success(data));
                        }
                    });
                }
            }
            else {
                try {
                    params = {
                        UserPoolId: process.env.UserPoolId,
                        Limit: eventParams.limit ? Number(eventParams.limit) : 10
                    };
                    if (eventParams.groupname) {
                        params.GroupName = eventParams.groupname;
                        listKey = 1;
                    }
                } catch(err) {
                    callback(null, failure(err));
                }
                if (listKey) {
                    cognitoidentityserviceprovider.listUsersInGroup(params, function(err, data){
                        if (err) {
                            callback(null, failure(err));
                        }
                        else {
                            callback(null, success(data));
                        }
                    });
                } else {
                    cognitoidentityserviceprovider.listUsers(params, function(err, data){
                        if (err) {
                            callback(null, failure(err));
                        }
                        else {
                            callback(null, success(data));
                        }
                    });
                }
            }
            break;
        case 'POST':
            /*
            path:
            params: {
                username: "",
                messageaction: "RESEND | SUPPRESS",
                email: "",
                name: ""
            }
            */
            try {
                params = {
                    UserPoolId: process.env.UserPoolId,
                    Username: eventParams.username,
                    DesiredDeliveryMediums: [
                        "EMAIL"
                    ],
                    MessageAction: eventParams.messageaction,
                    TemporaryPassword: "qwe123!@#",
                    UserAttributes: [
                        {
                            Name: "email",
                            Value: eventParams.email
                        },
                        {
                            Name: "name",
                            Value: eventParams.name
                        },
                    ]
                };
            } catch(err) {
                callback(null, failure(err));
            }
            cognitoidentityserviceprovider.adminCreateUser(params, function(err, data){
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
                requestkey: "",
            }
            */
            try {
                params = {
                    UserPoolId: process.env.UserPoolId,
                };
            } catch(err) {
                callback(null, failure(err));
            }
            if (eventParams.requestkey == 0){
                params.AuthFlow = process.env.AuthFlow;
                params.UserPoolId = process.env.UserPoolId;
                params.ClientId = process.env.ClientId;
                params.AuthParameters = {
                    USERNAME: eventParams.username,
                    PASSWORD: eventParams.password
                };
                cognitoidentityserviceprovider.adminInitiateAuth(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 1){
                params.ChallengeName = process.env.ChallengeName;
                params.UserPoolId = process.env.UserPoolId;
                params.ClientId = process.env.CliendId;
                params.ChallengeResponses = {
                    USERNAME: eventParams.username,
                    NEW_PASSWORD: eventParams.password ? eventParams.password : "qwe123!@#"
                };
                params.Session = eventParams.session;
                cognitoidentityserviceprovider.adminRespondToAuthChallenge(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 2){
                params.Username = eventParams.username;
                params.UserAttributes = [{
                    Name: "email_verified",
                    Value: "true"
                }];
                cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 3){
                params.Username = eventParams.username;
                params.Password = eventParams.password ? eventParams.password : "qwe123!@#";
                params.Permanent = false;
                cognitoidentityserviceprovider.adminSetUserPassword(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 4){
                params.Username = eventParams.username;
                cognitoidentityserviceprovider.adminConfirmSignUp(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            break;
        case 'DELETE':
            /*
            path:
            params: {
                username: "",
            }
            */
            try {
                params = {
                    Username: eventParams.username,
                    UserPoolId: process.env.UserPoolId
                };
            } catch(err) {
                callback(null, failure(err));
            }
            cognitoidentityserviceprovider.adminDeleteUser(params, function(err, data){
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
