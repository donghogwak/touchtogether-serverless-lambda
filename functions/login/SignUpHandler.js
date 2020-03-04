import { success, failure } from '../../lib/response-lib';

const AWS = require('aws-sdk');

if (!AWS.config.region) {
    AWS.config.update({
        region: process.env.AWS_REGION
    });
}

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

module.exports.signup = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    let operation = event.httpMethod;
    let params = {};
    let eventParams = JSON.parse(event.body);
    switch (operation) {
        case 'POST':
            /*
            path: /loginTestFunc
            params: {
                clientid: "",
                username: "",
                password: "",
                email:"",
                name:""
            }
            */
            try {
                params = {
                    ClientId: eventParams.clientid,
                    Username: eventParams.username,
                    Password: eventParams.password,
                    UserAttributes: [
                        {
                            Name: "email",
                            Value: eventParams.email
                        },
                        {
                            Name: "name",
                            Value: eventParams.name
                        }
                    ]
                };
            } catch(err) {
                callback(null, failure(JSON.stringify(err));
            }
            cognitoidentityserviceprovider.signUp(params, function(err, data){
                if (err) {
                    callback(null, failure(JSON.stringify(err));
                }
                else {
                    callback(null, success(JSON.stringify(data);
                }
            });
            break;
        default:
            callback(new Error('Error: "${operation)"'));
    }
};
