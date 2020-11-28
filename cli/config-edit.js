module.exports = {
	info: {
		commands: ["config","edit","<location>"],
		detection: `config edit ${process.argv[4] || ""}`,
		description: "Edit esix-cli config."
	},
	f: (argv)=>{
		if (argv.length < 3) {
			gb.m.signale.error("Not enough arguments given")
			process.exit(1)
		}
	}
}