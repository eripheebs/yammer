Yammer = {};

Yammer.requestCredential = function(options, credentialRequestCompleteCallback) {
    if (!credentialRequestCompleteCallback && typeof options === "function") {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({
        service: "yammer"
    });
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError()
        );
        return;
    }

    var credentialToken = Random.secret();

    var loginStyle = OAuth._loginStyle("yammer", config, options);

    var loginUrl = "https://www.yammer.com/dialog/oauth" +
        "?client_id=" + config.clientId +
        "&redirect_uri=" + OAuth._redirectUri("yammer", config) +
        "&state=" + OAuth._stateParam(loginStyle, credentialToken);

    OAuth.launchLogin({
        loginService: "yammer",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: { width: 900, height: 450 }
    });
};