const axios = require("axios");
const FormData = require("form-data")
const pkJSON = require("./../package.json")

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

	async _req(url) {
		try {
			this.checkCreds()

			var formobj = new FormData()
				formobj.append('login',this.username)
				formobj.append('password_hash',this.key)
			const options = {
				method: 'get',
				url: `https://e621.net/${url}`,
				headers: {
					'user-agent': `esix-api-${pkJSON.version}`,
					'content-type': 'application/x-www-form-urlencoded',
				},
				data: {
					login: this.username, password_hash: this.key
				},
			}
			const res = await axios(options)
			if (res.status !== 200) {
				new error(`HTTP(S) ERROR: ${req.status} - ${req.statusText}`)
				return {};
			} else {
				return res.data;
			}
		} catch(e) {
			console.error(e)
		}
	}

	async getPostsByTag(options) {
		/*
		options = {
			tags: [],
			limit: <int>
		}
		*/
		try {
			var limit = options.limit || "500";
			var req = await this._req(`posts.json?tags=${options.tags.join("+")}&limit=${limit}`)
			console.log(`[getPostsByTag] Fetched ${req.posts.length} posts with tag of ${options.tags.join("+")}`)
			return req;
		} catch (e) {
			console.error(e);
			return;
		}
	}
	async getPostsByTags(options) {
		/*
		options = {
			tags: [],
			limit: <int>
		}
		*/
		try {
			var posts = [];
			await this.asyncForEach(options.tags,async (b)=>{
				var o = await this._req(`posts.json?tags=${b}&limit=${options.limit || "320"}`)
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
				console.log(`[getPostsByTags] Tag: ${p.tag} => Fetched ${p.posts.length} posts.`)
			})
			console.log(`[getPostsByTags] Fetched ${allPostSize} posts`)
			return posts;
		} catch (e) {
			console.error(e)
		}
	}
	async getPostByID(postID) {
		try {
			if (postID == undefined) return error("postID is undefined");
			var res = await this._req(`posts/${postID}.json`);
			return res;
		} catch (e) {
			console.error(e)
		}
	}
	async getPoolsByQuery(queryName) {
		try {
			if (queryName === undefined) throw error("queryName is undefined");
			var reqURL = `pools.json?search[name_matches]=${queryName}&limit=5`
			var req = await this._req(reqURL)
			return {pools:req}
		} catch (e) {
			console.error(e)
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
			console.error(e)
		}
	}
	async getPoolInfo(poolID) {
		try {
			if (poolID === undefined) throw error("PoolID is undefined");
			var requestURL = `pools/${poolID}.json`
			var req = await this._req(requestURL)
			return {pools:req};
		} catch (e) {
			console.error(e)
		}
	}
	async getPostsByScore(options) {
		/*
		options = {
			tags: [],
			limit: <int>
		}
		*/
		try {
			var posts = [];
			await this.asyncForEach(options.tags,async (b)=>{
				var o = await this._req(`posts.json?tags=score:${b}%3E&limit=${options.limit || "320"}`)
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
				console.log(`[getPostsByScore] Score: ${p.tag} => Fetched ${p.posts.length} posts.`)
			})
			console.log(`[getPostsByScore] Fetched ${allPostSize} posts`)
			return posts;
		} catch (e) {
			console.error(e)
		}
	}
}

module.exports = API