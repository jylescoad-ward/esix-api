class esixAPI {

	DebugMode = false;
	Configuration = {};

	wrappers = {
		HTTP: require("./HTTP.js"),
		CustomLog: require("./CustomLogger.js")
	}

	pstring = require("./strings.json")

	features = {
		post: require("./post.js"),
		pool: require("./pool.js"),
		account: require("./account.js"),
		user: require("./user.js")
	}

	_validateConfiguration()
	{
		if (this.esixConfiguration == undefined) throw new Error(this.pstring.validation.undefinedConfiguration);

		let cfg = this.esixConfiguration;

		// Username Regex;
		//	^[a-zA-Z0-9_-]{0,28}
		if (cfg.username == undefined) throw new Error(this.pstring.validation.undefinedUsername);
		if (!cfg.username.match(/^[a-zA-Z0-9_-]{0,28}/g)) throw new Error(this.pstring.validation.invalidUsername);


		// Password Regex;
		//	^[a-zA-Z0-9_-]{0,64}
		if (cfg.password = undefined) throw new Error(this.pstring.validation.undefinedPassword);
		if (!cfg.password.match(/^[a-zA-Z0-9_-]{0,64}/g)) throw new Error(this.pstring.validation.invalidPassword);
	
		return true;
	}


	// Check if the authentication given in this.esixConfiguration
	//		uses a valid username/password combonation. Will throw
	//		an error if the user is using their actual password
	//		instead of the API key in account details
	_checkAuthentication()
	{

	}

	constructor(userConfig)
	{
		/*
		userConfig = 
		{
			username: '',
			password: '',
			debug: boolean
		}
		*/
		this.Logger = new this.wrappers.CustomLog();

		this.Configuration = userConfig;

		if (userConfig == undefined) throw new Error(this.pstring.validation.undefinedConfiguration);

		userConfig.debug != undefined && userConfig.debug == true ? this.DebugMode = true : this.DebugMode = false

		let isValid = this._validateConfiguration() || false;

		if (!isValid) throw  new Error(this.pstring.unhandledException);

		// Setup custom HTTP client
		this.HTClient = new this.wrappers.HTTP( this );

		this.HTClient.on('initalize', () => {
			this.Logger("HTTP(s) Client Initalized")
		})
	}

}

module.exports = esixAPI;