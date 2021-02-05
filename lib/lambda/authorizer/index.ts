export const handler = async (event: any = {}, context: any = {}, callback: any ={}): Promise<any> => {
    console.log(event)

    const authorizationHeader = event.headers.Authorization // 'Basic YWRtaW46bXlwYXNzd29yZA=='
    console.log('authorizationHeader: ' + authorizationHeader);

    if (!authorizationHeader) {
        callback('Unauthorized');
    }

    const encodedCredentials = authorizationHeader.split(' ')[1] // 'YWRtaW46bXlwYXNzd29yZA=='
    const plainCredentials = (Buffer.from(encodedCredentials, 'base64')).toString().split(':') // ['admin', 'mypassword']
    const username = plainCredentials[0] // 'admin'
    const password = plainCredentials[1] // 'mypassword'

    console.log('plainCredentials: ' + plainCredentials)

    if (!(username === 'admin' && password === 'mypassword')) {
        callback('Unauthorized');
    }

    const authResponse = buildAllowAllPolicy(event, username)
    console.log('authResponse: ' + JSON.stringify(authResponse))

    callback(null, authResponse)
}

type Policy = {
    principalId: string,
    policyDocument: {
        Version: string,
        Statement: [
            {
                Action: string,
                Effect: string,
                Resource: string,
            }
        ]
    }
}

function buildAllowAllPolicy (event: any = {}, principalId: string): Policy {
    const policy: Policy = {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: event.methodArn
                }
            ]
        }
    }

    return policy
}