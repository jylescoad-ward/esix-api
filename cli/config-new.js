module.exports = {
	info: {
		commands: ["config","new"],
		description: "create new config, step by step thing like npm init"
	},
	f: async ()=>{
		var inquirer = gb.m.inq
		var questions = [
			{
				type: 'input',
				name: 'tags',
				message: "Enter Tags. Seperate Indivudal Tags with commas, for multiple tags put + inbetween each tag\n>"
			},
			{
				type: 'input',
				name: 'tagLimit',
				message: 'Post Limit per Tag\n>',
				default: 320
			},
			{
				type: 'input',
				name: 'threadLimit',
				message: 'Maximum ammount of threads/instances for downloading\n>',
				default: 4,
			},
			{
				type: 'input',
				name: 'username',
				message: 'e621 Username\n>',
				default: gb.cliConfig.all.auth.username
			},
			{
				type: 'password',
				name: 'key',
				message: 'e621 API Key\n>',
				default: gb.cliConfig.all.auth.key
			}
		]
		var ans = {};
		await inquirer.prompt(questions).then((answers) => {
			answers.tags = answers.tags.split(",")
			ans = answers;
		});
		console.log()
		var config = gb.cliConfig;
		config.clear()
		gb.cliConfig.all = {
			tags: ans.tags,
			options: {
				limit: ans.tagLimit,
				threads: ans.threadLimit,
			},
			auth: {
				username: ans.username,
				key: ans.key,
			}
		};
		gb.m.signale.info(`[config-new] Checking Account Details`);
		var testDetails = new gb.m.esix(gb.cliConfig.all.auth)
		var output = await testDetails._req("posts.json?tags=esix&limit=1")
		if (output.posts !== undefined) {
			gb.m.signale.success(`[config-new] Account Details work!`)
		} else {
			gb.m.signale.error(`[config-new] Account Details not working, please double check them.`);
		}
	}
}