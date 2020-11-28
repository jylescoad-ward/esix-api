#!/usr/bin/env node

const { forEach } = require("async");
var Configstore = require("configstore")

global.gb = {
	cliConfig: new Configstore(`${require("./package.json").name}-cli`,
	// Default Config
	{
		tags: [],
		options: 
		{
			limit: 320,
			threads: 4,
		}
	}),
	m: {
		arguhand: require("minimist"),
		Configstore: require("configstore"),
		signale: require("signale"),
		chalk: require("chalk"),
		fs: require("fs"),
		esix: require("./classes/api.js"),
		packageJSON: require("./package.json"),

	},
	asyncForEach: async (array,callback)=>{
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	},
	getFiles: (p)=>{
		var path = `${__dirname}/${p}`
		return gb.m.fs.readdirSync(path).filter(function (file) {
			return gb.m.fs.statSync(path+'/'+file).isFile();
		});
	},
}

// populate the commands variable, its from da files.
var cliFiles = gb.getFiles(`cli`)
gb.commands = [];
cliFiles.forEach((c)=>{
	var cf = require(`${__dirname}/cli/${c}`)
	if (c.toLowerCase() == 'example.js') return;
	if (cf.f == undefined) return;
	if (cf.info == undefined) return;
	if (cf.info.commands == undefined) return;
	if (cf.info.description == undefined) return;

	gb.commands.push(cf);
})

gb.argHandle = async ()=>{
	// argument handler
	var t_args = process.argv;

	if (t_args[2] == undefined) {
		/// Run Help Command
		gb.m.signale.error("No Command was given, Printing help then aborting...")
		gb.commands.forEach(async (cmd)=>{
			if (cmd.info.commands[0].toLowerCase() == 'help') {
				await cmd.f();
				process.exit(1);
			}
		})
	}
}

gb.argHandle();