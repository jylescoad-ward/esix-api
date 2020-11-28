module.exports = {
	info: {
		commands: ["download"],
		description: "download everything from the configs tags with the options in the config"
	},
	f: ()=>{
		const fs = gb.m.fs;
		const progress = gb.m.progress;
		const esix = new gb.m.esix(gb.cliConfig.all.auth);
		const https = require("https")

		var downloadBaseDirectory = process.cwd()
		var config = gb.cliConfig.all;
		const dl = new progress.MultiBar({
			format: "{bar} || {value}/{total} posts || {task}",
			clearOnComplete: false,
			hideCursor: true,
			autopadding: true
		 
		}, progress.Presets.shades_classic  )
		config.tags.forEach((tag)=>{
			console.log(`Downloading tag "${tag}".`)
			var downloadDirectory = `${downloadBaseDirectory}/${tag}`;
			if (!fs.existsSync(`${downloadBaseDirectory}/${tag}`)) {
				fs.mkdirSync(downloadDirectory)
			}
			esix.getPostsByTag({tags:[tag],limit:config.options.limit}).then((oldResult)=>{
				var result = {posts:[]}
				oldResult.posts.forEach((r)=>{
					if (typeof r.file.url == 'string') {
						result.posts.push(r);
						return;
					}
				})
				var tagDownload = dl.create(result.posts.length,0,{task:tag});
				result.posts.forEach((post)=>{
					var downloadLink = post.file.url;
					if (typeof downloadLink != 'string') return;
					var fileName = `${post.id}.${post.file.ext}`;
					if (fs.existsSync(fileName)) {
						tagDownload.increment();
						return;
					}else {
						var request = https.get(downloadLink,(res)=>{
							var file = fs.createWriteStream(`${downloadDirectory}/${fileName}`);
							res.pipe(file)
							file.on('finish',()=>{
								file.close();
								tagDownload.increment()
								request.end();
								return;
							})
						})
						request.on('error',(err)=>{ // Handle errors
							if (fs.existsSync(`${downloadDirectory}/${fileName}`)) {
								fs.unlinkSync(`${downloadDirectory}/${fileName}`); // Delete the file async. (But we don't check the result)
							}
							console.error(err)
							request.end();
						});
						return;
					}
				})
			})
		})
		dl.stop();
	}
}