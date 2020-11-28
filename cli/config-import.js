module.exports = {
	info: {
		commands: ["config","import",`${process.argv[4] || ""}`],
		helpcommand: ["config","import"],
		description: "import config from config location, also verify it."
	},
	f: ()=>{
		if (argv.length < 3) {
			gb.m.signale.error("Not enough arguments given")
			process.exit(1)
		}
	}
}