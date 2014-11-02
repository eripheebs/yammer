Yammer = {};

OAuth.registerService("yammer", 2, null, function (query) {
    var identity = getIdentity(query);
    var userProfile = identity.userProfile;

    return {
        serviceData: {
            id: "yammer_" + identity.user.id,
            accessToken: OAuth.sealSecret(identity.access_token.token),
            email: identity.user.contact.email_addresses[0].address,
            username: "yammer_" + identity.user.id
        },
        options: {
            profile: {
                name: identity.user.full_name,
                first_name: userProfile.first_name,
                last_name: userProfile.last_name,
                job_title: userProfile.job_title,
                department: userProfile.department,
                network: identity.user.network_name,
                timezone: identity.user.timezone,
                mugshot_url_template: userProfile.mugshot_url_template
            }
        }
    }
});

var userAgent = "Meteor";
if (Meteor.release) {
    userAgent += "/" + Meteor.release;
}

var getIdentity = function (query) {
    var config = ServiceConfiguration.configurations.findOne({service: "yammer"});
    if (!config) {
        throw new ServiceConfiguration.ConfigError();
    }

    var response, profileResponse, token;
    try {
        response = HTTP.get("https://www.yammer.com/oauth2/access_token.json", {
            headers: {
                Accept: "application/json",
                "User-Agent": userAgent
            },
            params: {
                client_id: config.clientId,
                client_secret: OAuth.openSecret(config.secret),
                code: query.code
            }
        });
    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with Yammer. " + err.message),
            {response: err.response});
    }

    token = response.data.access_token.token;

    try {
        profileResponse = HTTP.get("https://www.yammer.com/api/v1/users/current.json", {
            headers: {
                Accept: "application/json",
                "User-Agent": userAgent,
                Authorization: "Bearer " + token
            }
        });
    } catch (err) {
        throw _.extend(new Error("Failed to retrieve profile data from Yammer. " + err.message),
            {response: err.response});
    }

    response.data.userProfile = profileResponse.data;

    return response.data;
};

Yammer.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
}