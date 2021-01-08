const axios = require("axios");
const pkJSON = require("./../package.json")
const PostManager = require("./post");
async function asyncForEach (array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}
module.exports = async (g_url,g_method,g_data,g_creds) => {
	const options = {
		method: g_method || 'GET',
		url: `https://e621.net/${g_url}`,
		headers: {
			'user-agent': `esix-api_${pkJSON.version}`,
			'content-type': 'application/x-www-form-urlencoded',
		},
		data: g_data || {},
	}
	options.data.login = g_creds.username;
	options.data.api_key = g_creds.key;
	options.method = options.method.toUpperCase()
	if (options.method == "POST" || options.method == "DELETE") {
		options.headers['content-type'] = "application/json";
	}
	if (typeof window != undefined) {
		if (options.url.includes("?")) {
			options.url = `${options.url}&_client=esix-api_${pkJSON.version}`;
		} else {
			options.url = `${options.url}?_client=esix-api_${pkJSON.version}`;
		}
		options.data._client = `esix-api_${pkJSON.version}`;
	}

	var res = {};
	var resData = {};
	try {
		res = await axios(options);
		resData = res.data || {};
	} catch (error) {
		res = error.response || {};
		resData = error.response.data;
	} finally {
		console.debug(res)
		if (res.status >= 300) {
			if (resData.message != undefined) {
				console.error(`HTTP(S) ERROR: ${resData.code || res.status} - ${resData.message}`)
				resData.code = resData.code || res.status;
			} else {
				console.error(`HTTP(S) ERROR: ${res.status} - ${res.statusText}`)
			}
			return resData;
		} else {
			if (res.data.posts == undefined) {
				return res.data;
			}
			var tempData = {posts:[]};
			await asyncForEach(res.data.posts,(p)=>{
				tempData.posts.push(PostManager.gen(p,g_creds,res));
			})
			return tempData;
		}
	}
}