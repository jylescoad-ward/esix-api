module.exports = {
	info: {
		commands: ["download","--config=<location>"],
		detection: `download ${process.argv[3] || ""}`,
		description: "the same as 'esix download' but overrides with the config given."
	},
	f: (argv)=>{
		require("./download.js").f(argv)
	}
}