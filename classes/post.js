var raw = {};
var creds = {};

async function req(u,m,d) {
	const httpRequest = require("./request.js");
	return httpRequest(u,m,d,creds);
}
async function checkFavorite(g_pid) {
	const favorites = await req('favorites.json');
	var found = false
	favorites.posts.forEach((p)=>{
		if (g_pid == p.id) {
			return true;
			found = true
		}
	})
	return found;
}
module.exports.gen = (g_data,g_creds,g_res) => {
	creds = g_creds;
	raw = g_data;

	raw.vote = module.exports.vote;
	raw.favorite = module.exports.favorite;
	
	if (raw.file.md5 != undefined && raw.file.ext != undefined && raw.file.ext != "swf") {
		raw.file.url = 'https://static1.e621.net/data/' + raw.file.md5.slice(0, 2)  + '/' + raw.file.md5.slice(2, 4) + '/' + raw.file.md5 + '.' + raw.file.ext;
		if (raw.sample.has) {
			raw.sample.url = 'https://static1.e621.net/data/sample/' + raw.file.md5.slice(0, 2)  + '/' + raw.file.md5.slice(2, 4) + '/' + raw.file.md5 + '.jpg';
		}
		switch (raw.file.ext) {
			case "png":
			case "jpg":
			case "webm":
				raw.preview.url = 'https://static1.e621.net/data/preview/' + raw.file.md5.slice(0, 2)  + '/' + raw.file.md5.slice(2, 4) + '/' + raw.file.md5 + '.jpg';
				break;
		}
		
	}
	
	raw.rawResponse = g_res;
	return raw;
}

module.exports.vote = async (direction,nounvote) => {
	var voteDirection = '0';
	if (direction == true) {
		voteDirection = '1';
	} else if (direction == false) {
		voteDirection = '-1';
	}
	var response = await req(`posts/${raw.id}/votes.json`,'post',{score:voteDirection,no_unvote:nounvote || true});
	return response;
}

module.exports.favorite = async (action) => {
	if (action == undefined) {
		console.error("Action is undefined, must pass true or false.");
		return;
	}
	if (action) {
		var response = await req(`favorites.json?post_id=${raw.id}`,'post',{post_id:raw.id});
		return response;
	} else {
		var response = await req(`favorites/${raw.id}.json`,'delete');
		return response;
	}
}