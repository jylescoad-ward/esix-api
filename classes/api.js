const axios = require("axios");
const FormData = require("form-data")
const pkJSON = require("./../package.json")

class API {
	constructor(cfg) {
		this.username = cfg.username;
		this.key = cfg.key;
	}

	async _req(url) {
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
		try {
			const res = await axios(options)
			console.debug(res.data)
		} catch(e) {
			console.error(e)
		}
	}

	async posts(options) {
		/*
		options = {
			tags: [],
			limit: <int>
		}
		*/
		try {
			var limit = ` `;
			if (options.limit > 1 || options.limit !== undefined) {
				limit = `&limit=${options.limit}`;
			}
			var req = await this._req(`posts.json?tags=${options.tags.join("+")}`)
			return req.posts
		} catch (e) {
			console.error(e);
			return;
		}
	}
	async poolSearch(queryName,pageNo) {
		try {
			if (queryName === undefined) return error("queryName is undefined.");
			var reqURL = `pool/index.json?query=${queryName}`
			if (pageNo !== undefined && typeof pageNo == 'number') {
				reqURL+= `&page=${pageNo}`;
			}
		} catch (e) {
			throw e;
		}
	}
	async pool(poolID,page) {
		try {
			if (poolID === undefined) return error("PoolID is Undefined");
			var requestURL = `pools.json`
			var req = this._req(`pools.json`)
		} catch (e) {
			throw e;
		}
	}
}

module.exports = API