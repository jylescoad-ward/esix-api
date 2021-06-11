class Logger {
	History = [
		/*
		{
			timestamp: Date.now(),
			info: Input String from log function,
		}
		*/
	]

	Prefix = "";
	Debug = false;

	CreatedAt = 0;
	UUID = "unknown";

	constructor(LogPrefix,IsDebug)
	{
		this.CreatedAt = Date.now();
		this.UUID = require("tinytoolbox").stringGen(12,3);
		LogPrefix == undefined ? this.Prefix = "" : this.Prefix = `[${LogPrefix}] `;
		IsDebug == undefined ? this.Debug = false : this.Debug = true;
	}

	CallbackEvents = [
		/*
		{
			type: error | info | warn | debug | fatal,
			cb: Array<function>,
		}
		*/
	];

	on(ErrorType,...Callback)
	{
		switch(ErrorType.toLowerCase().trim())
		{
			case "error":
			case "info":
			case "warn":
			case "debug":
			case "fatal":
				this.CallbackEvents.push({
					type: ErrorType.toLowerCase().trim(),
					cb: Callback
				});
				break;
			default:
				throw new Error("Invalid Error Type '"+ErrorType+"'");
				break;
		}
	}

	_eventCall(type,data)
	{
		this.CallbackEvents.find(d => d.type == type).forEach( c => c.cb.forEach(ccb => ccb(data)));
	}

	DestroyInstance()
	{
		this.History = [];
		if (!this.Debug) return;
		console.log(this.UUID,": Destroyed Instance Data at ",Date.now());
	}

	Error(...loginfo)
	{
		console.error('ERROR | ',this.Prefix,loginfo.join(" : "));
		this.History.push({
			timestamp: Date.now(),
			data: loginfo,
			type: 'error'
		});
		this._eventCall('error',loginfo.join(' : '));
	}
	err = this.Error;
	e = this.Error;

	Fatal(...loginfo)
	{
		console.error('FATAL | ',this.Prefix,loginfo.join(" : "));
		this.History.push({
			timestamp: Date.now(),
			data: loginfo,
			type: 'fatal',
		})
		this._eventCall('fatal',loginfo.join(' : '));
	}
	f = this.Fatal;
	ferror = this.Fatal;
	fe = this.Fatal;

	Info(...loginfo)
	{
		console.log('INFO  | ',this.Prefix,loginfo.join(" : "));
		this.History.push({
			timestamp: Date.now(),
			data: loginfo,
			type: 'info'
		})
		this._eventCall('info',loginfo.join(' : '));
	}
	i = this.Info;

	Debug(...loginfo)
	{
		console.debug('DEBUG | ',this.Prefix,loginfo.join(" : "));
		this.History.push({
			timestamp: Date.now(),
			data: loginfo,
			type: 'debug'
		})
		this._eventCall('debug',loginfo.join(' : '));
	}
	d = this.Debug;

	Warn(...loginfo)
	{
		console.warn('WARN  | ',this.Prefix,loginfo.join(" : "))
		this.History.push({
			timestamp: Date.now(),
			data: loginfo,
			type: 'warn',
		})
		this._eventCall('warn',loginfo.join(' : '));
	}
	Warning = this.Warn;
	w = this.Warn;
}
module.exports = Logger;