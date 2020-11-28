module.exports = {
	info: {
		commands: ["config","new"],
		description: "create new config, step by step thing like npm init"
	},
	f: ()=>{
		var questions = [
			{
				type: 'input',
				name: 'tags',
				message: "Enter Tags. Seperate Indivudal Tags with commas, for multiple tags put + inbetween each tag."
			},
			{
				type: 'input',
				name: 'tagLimit',
				message: 'Post Limit per Tag (default: 320)'
			},
			{
				type: 'input',
				name: 'threadLimit',
				message: 'Maximum ammount of threads/instances for downloading. (default: 4)'
			}
		]
		inquirer.prompt(questions).then((answers) => {
			console.log(JSON.stringify(answers, null, '  '));
		});
		//var previousConfig = gb.cliConfig.all;
	}
}