module.exports = {
	info: {
		commands: ["config","set","<field>","<data>"],
		detection: `config set ${process.argv[4] || ""} ${process.argv[5] || ""}`,
		description: "find the [field] object in the json and replace its data with [data]"
	},
	f: (argv)=>{
		if (argv.length < 4) {
			gb.m.signale.error("Not enough arguments given")
			process.exit(1)
		}
	}
}