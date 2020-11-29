const fs = gb.m.fs;
var dl = null;
var startTime = null;
function msToHMS( ms ) {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = Math.round(seconds % 3600); // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
	seconds = seconds % 60;
	return `${hours || "00"}:${minutes || "00"};${seconds}`
}
function validateResult(location,originalMD5,tagDownload) {
	var md5 = require("md5");
	tagDownload.increment()

	// If this returns true that means download it.
	// If this returns false that  means skip this file.

	// If file does not exist just return true
	if (!fs.existsSync(location)) {
		return true;
	}
	fs.readFile(location,(e,b)=>{
		var fileMD5 = md5(b);
		if (originalMD5 != fileMD5) {
			// If the files md5 is invalid (according to e621) delete it then return true, this means download it.
			fs.unlinkSync(location);
			return true;
		} else {
			// if the files md5 is valid return false, that means don't re-download.
			return false;
		}
	})
	var things1 = 0;
	dl.bars.forEach((b)=>{
		if (b.value === b.total) {
			things1++
		}
	})
	if (things1 === gb.cliConfig.all.tags.length) {
		setTimeout(()=>{
			var endTime = new Date().getTime()
			console.log(`\r\nCompleted '${things1}' tag(s). Took ${msToHMS(Math.abs(endTime - startTime))}`)
			process.exit(1)
		},500)
	}
}

module.exports = {
	info: {
		commands: ["download"],
		description: "download everything from the configs tags with the options in the config"
	},
	f: async ()=>{
		const progress = gb.m.progress;
		const esix = new gb.m.esix(gb.cliConfig.all.auth);
		const https = require("https");
		startTime = new Date().getTime()

		var downloadBaseDirectory = process.cwd()
		var config = gb.cliConfig.all;
		dl = new progress.MultiBar({
			format: `${gb.m.chalk.cyan("[{bar}]")} {percentage}% || {value}/{total} posts || {task}`,
			clearOnComplete: false,
			hideCursor: true,
			autopadding: true
		 
		}, progress.Presets.legacy  )
		await gb.asyncForEach(config.tags,(tag)=>{
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
					}
				})
				var manifestLocation = `${downloadDirectory}/manifest-${startTime / 1000}.json`
				fs.writeFile(manifestLocation,JSON.stringify(result,null,'\t'),(e)=>{
					if (e) {
						fs.unlinkSync(manifestLocation)
						throw e;
					}
				})
				var tagDownload = dl.create(result.posts.length,0,{task:tag})
				result.posts.forEach((post)=>{
					var downloadLink = post.file.url;
					var fileName = `${post.id}.${post.file.ext}`;
					var fileLocation = `${downloadDirectory}/${fileName}`;
					if(typeof downloadLink != 'string') return;
					var doDownload = validateResult(fileLocation,post.file.md5,tagDownload);
					if (!doDownload) {
						return;
					}

					// Download Post
					var request = https.get(downloadLink,(res)=>{
						var file = fs.createWriteStream(fileLocation);
						res.pipe(file)
						file.on('finish',()=>{
							file.close()
							request.end()
							validateResult(fileLocation,post.file.md5,tagDownload)
						})
					})
					request.on('error',(e)=>{
						request.end()
						validateResult(fileLocation,post.file.md5,tagDownload);
					})
				})
			})
		})
		dl.stop()
	}
}