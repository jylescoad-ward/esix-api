var raw = {};
var creds = {};

async function req(u,m,d) {
	const httpRequest = require("./request.js");
	return httpRequest(u,m,d,creds);
}

module.exports.gen = (g_data,g_creds,g_res) => {
	creds = g_creds;
	raw = g_data;

	raw.vote = module.exports.vote;
	raw.favorite = module.exports.favorite;
	raw.raw = g_res;
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