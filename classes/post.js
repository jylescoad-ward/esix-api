var req = "";
const axios = require("axios");
const pkJSON = require("./../package.json")

var raw = {};
var creds = {};

module.exports = (g_data,g_creds) => {
	creds = g_creds;
	raw = g_data;
	raw.vote = module.exports.vote;
	//raw.favorite = module.exports.favorite;
	return raw;
}
module.exports.req = async (url,g_method,g_data) =>{
	const options = {
		method: g_method || 'GET',
		url: `https://e621.net/${url}`,
		headers: {
			'user-agent': `esix-api-${pkJSON.version}`,
		},
		data: g_data || {},
	}
	options.data.login = creds.username;
	options.data.api_key = creds.key;
	options.method = options.method.toUpperCase()
	if (options.method == "POST" || options.method == "DELETE") {
		options.headers['content-type'] = "application/json";
	}
	const res = await axios(options).catch((e)=>{
		console.debug(e.toJSON())
		console.error(`HTTP(S) ERROR: ${e.status} - ${e.statusText}`)
	})
	if (options.method == "POST" || options.method == "DELETE") {
		console.debug(res);
	}
	if (res.status != undefined && res.status >= 300) {
		console.error(`HTTP(S) ERROR: ${req.status} - ${req.statusText}`)
		return {posts:[]};
	} else {
		return res.data;
	}
}

module.exports.vote = async (direction,nounvote) => {
	var voteDirection = '0';
	if (direction == true) {
		voteDirection = '1';
	} else if (direction == false) {
		voteDirection = '-1';
	}
	var response = await module.exports.req(`posts/${raw.id}/votes.json`,'post',{score:voteDirection,no_unvote:nounvote || true});
	return response;
}

module.exports.favorite = async (action) => {
	if (action == undefined) {
		console.error("Action is undefined, must pass true or false.");
		return;
	}
	if (action) {
		var response = await module.exports.req(`favorites.json?post_id=${raw.id}`,'post',{post_id:raw.id});
		return response;
	} else {
		var response = await module.exports.req(`favorites/${raw.id}.json`,'delete');
		return response;
	}
}