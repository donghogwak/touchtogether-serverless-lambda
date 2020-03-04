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
                    nexttoken : "required : no",
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
            eventParams = JSON.parse(event.queryStringParameters);
            if (eventParams.nexttoken) {
                try {
                    params = {
                        UserPoolId: process.env.UserPoolId,
                        PaginationToken: eventParams.nexttoken,
                        Limit: eventParams.limit ? eventParams.limit : 10
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
                        Limit: eventParams.limit ? eventParams.limit : 10
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
                clientid: "",
                username: "",
                email: "",
                name: ""
            }
            */
            try {
                params = {
                    UserPoolId: process.env.UserPoolId,
                    ClientId: eventParams.clientid,
                    Username: eventParams.username,
                    DesiredDeliveryMediums: [
                        "EMAIL",
                    ],
                    MessageAction: "SUPPRESS",
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
                clientid: ,
                username: ,
                email: "",
                name: ""
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
            if (eventParams.requestkey == 0){
                cognitoidentityserviceprovider.adminConfirmSignup(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 1){
                cognitoidentityserviceprovider.adminResetUserPassword(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 2){
                params.password = eventParams.password;
                cognitoidentityserviceprovider.adminSetUserPassword(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 3){
                params.CustomAttributes = JSON.parse(eventParams.customattributes);
                /*[
                    {
                        AttributeDataType: String | Number | DateTime | Boolean,
                        DeveloperOnlyAttribute: true || false,
                        Mutable: true || false,
                        Name: 'STRING_VALUE',
                        NumberAttributeConstraints: {
                            MaxValue: 'STRING_VALUE',
                            MinValue: 'STRING_VALUE'
                        },
                        Required: true || false,
                        StringAttributeConstraints: {
                            MaxLength: 'STRING_VALUE',
                            MinLength: 'STRING_VALUE'
                        }
                    },
                ] */
                cognitoidentityserviceprovider.addCustomAttributes(params, function(err, data){
                    if (err) {
                        callback(null, failure(err));
                    }
                    else {
                        callback(null, success(data));
                    }
                });
            }
            else if (eventParams.requestkey == 4){
                params.UserAttributeNames = eventParams.userattrnames;
                cognitoidentityserviceprovider.adminDeleteUserAttributes(params, function(err, data){
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
                clientid: ,
                username: ,
                email: "",
                name: ""
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
