module.exports = {
	f: async ()=>{
		console.log(`[help] Found '${gb.commands.length}' commands.`)
		await gb.asyncForEach(gb.commands,(c)=>{
			var cmdString = c.info.commands;
			c.info.commands[0] = `${gb.m.chalk.magenta(c.info.commands[0])}`;
			if (c.info.commands[1] != undefined) {
				c.info.commands[1] = `${gb.m.chalk.yellow(c.info.commands[1])}`;
			}

			var printString = `${gb.m.chalk.cyan('esix')} ${cmdString.join(" ")}\r\n\t${c.info.description}\r\n`;
			console.log(printString)
		})
		return;
	},
	info: {
		commands: ["help"],
		description: "Prints help information on how to use esix-cli"
	}
}