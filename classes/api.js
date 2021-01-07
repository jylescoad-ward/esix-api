const axios = require("axios");
const FormData = require("form-data")
const pkJSON = require("./../package.json")

const PostManager = require("./post.js")

class API {
	constructor(cfg) {
		this.username = cfg.username;
		this.key = cfg.key;
	}

	checkCreds(){
		if (this.username == undefined) {
			throw Error("'this.username' is undefined")
		}
		if (this.key == undefined) {
			throw Error("'this.key' is undefined")
		}
	}

	async asyncForEach (array, callback) {
		for (let index = 0; index < array.length; index++) {
			await callback(array[index], index, array)
		}
	}

	async _req(url,g_method,g_data) {
		this.checkCreds()

		const options = {
			method: g_method || 'GET',
			url: `https://e621.net/${url}`,
			headers: {
				'user-agent': `esix-api_${pkJSON.version}`,
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: g_data || {},
		}
		options.data.login = this.username;
		options.data.api_key = this.key;
		options.method = options.method.toUpperCase()
		if (options.mehod == "POST") {
			options.headers['content-type'] = "application/json";
		}
		if (typeof window != undefined) {
			options.url = `${options.url}&_client=esix-api_${pkJSON.version}`;
			options.data._client = `esix-api_${pkJSON.version}`;
		}
		const res = await axios(options)
		if (res.status !== 200) {
			console.error(`HTTP(S) ERROR: ${req.status} - ${req.statusText}`)
			return {posts:[]};
		} else {
			if (res.data.posts == undefined) {
				return res.data;
			}
			var tempData = {posts:[]};
			await this.asyncForEach(res.data.posts,(p)=>{
				tempData.posts.push(PostManager(p,this));
			})
			return tempData;
		}
	}

	async getPostsByTag(options) {
		/*
		options = {
			tags: [],
			limit: <int>,
			page: <int>
		}
		*/
		try {
			var limit = options.limit || "1024";
			var req = await this._req(`posts.json?tags=${options.tags.join("+")}&limit=${limit}&page=${options.page || '1'}`)
			return req;
		} catch (e) {
			throw e;
		}
	}
	async getPostsByTags(options) {
		/*
		options = {
			tags: [],
			limit: <int>,
			page: <int>
		}
		*/
		try {
			var posts = [];
			await this.asyncForEach(options.tags,async (b)=>{
				var o = await this._req(`posts.json?tags=${b}&limit=${options.limit || "320"}&page=${options.page || '1'}`)
				var myThing = {
					tag: b,
					posts: []
				};
				o.posts.forEach((c)=>{
					myThing.posts.push(c)
				})
				posts.push(myThing)
			})
			var allPostSize = 0;
			await this.asyncForEach(posts,(p)=>{
				allPostSize = allPostSize + p.posts.length
			})
			return posts;
		} catch (e) {
			throw e
		}
	}
	async getPostByID(postID) {
		try {
			if (postID == undefined) return error("postID is undefined");
			var res = await this._req(`posts/${postID}.json`);
			return res;
		} catch (e) {
			throw e
		}
	}
	async getPoolsByQuery(queryName) {
		try {
			if (queryName === undefined) throw error("queryName is undefined");
			var reqURL = `pools.json?search[name_matches]=${queryName}&limit=5&page=${options.page || '1'}`
			var req = await this._req(reqURL)
			return {pools:req}
		} catch (e) {
			throw e
		}
	}
	async getPoolPostsByID(poolID) {
		try {
			if (poolID == undefined) throw error("PoolID is undefined")
			var reqURL = `pools/${poolID}.json`;
			var retVal = {posts: []}
			var poolReq = await this._req(reqURL);
			await this.asyncForEach(poolReq.post_ids,async (pid)=>{
				var req = await this._req(`posts/${pid}.json`);
				retVal.posts.push(req.post)
			})
			return retVal;
		} catch (e) {
			throw e
		}
	}
	async getPoolInfo(poolID) {
		try {
			if (poolID === undefined) throw error("PoolID is undefined");
			var requestURL = `pools/${poolID}.json`
			var req = await this._req(requestURL)
			return {pools:req};
		} catch (e) {
			throw e
		}
	}
}

module.exports = API
