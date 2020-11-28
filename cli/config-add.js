module.exports = {
	info: {
		commands: ["config","add","<field>","<data>"],
		detection: `config add ${process.argv[4] || ""} ${process.argv[5] || ""}`,
		description: "add [data] to [field] if its an array"
	},
	f: (argv)=>{
		if (argv.length < 4) {
			gb.m.signale.error("Not enough arguments given")
			process.exit(1)
		}
	}
}