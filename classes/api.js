const axios = require("axios");
const FormData = require("form-data")
const pkJSON = require("./../package.json")
var httpRequest = require("./request.js");

const PostManager = require("./post.js")

class API {
	constructor(cfg) {
		this.username = cfg.username;
		this.key = cfg.key;
	}

	async _req (u,m,d){
		return httpRequest(u,m,d,{username:this.username,key:this.key},true);
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
					posts: [],
					page: options.page
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
	async votePost (direction,id,nounvote) {
		var voteDirection = '0';
		if (direction == true) {
			voteDirection = '1';
		} else if (direction == false) {
			voteDirection = '-1';
		}
		var response = await this._req(`posts/${id}/votes.json`,'post',{score:voteDirection,no_unvote:nounvote || true});
		return response;
	}
}

module.exports = API
