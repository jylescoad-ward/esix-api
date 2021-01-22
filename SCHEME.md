# Directory
- [API](#API) (Classes)
	- [_req](#_req)
	- [getPostsByTag](#getPostsByTag)
	- [getPostsByTags](#getPostsByTags)
	- [getPostByID](#getPostByID)
	- [getPoolsByQuery](#getPoolsByQuery)
	- [getPoolPostsByID](#getPoolPostsByID)
	- [getPoolInfo](#getPoolInfo)
	- [votePost](#votePost)
- [Types](#Types)
	- [Post](#Post)
	- [Pool](#Pool)
	- [Tags](#Tags)
	- [Relationships](#Relationships)
	- [Flags](#Flags)

## API
Usage
```js
const esix = require("esix-api")
const <api> = new esix({username:<string>,key:<string>})
```


### _req
Usage
```javascript
<api>._req(<URL::string>,<Method::string>,<Data::string>)
```

Returns
```javascript
//If post query
{
	posts: [
		<type::post>
	]
}

//If post
{
	<type::post>
}

//If pool
{
	<type::pool>
}

//If error
{
	<axios_error>
}
```

### getPostsByTag
Usage
```js
<api>.getPostsByTag({
	tags: <array>,// What tags should be queryed 		(All object will be combined with '+')
	limit: <int>, // Maximum ammount of posts per query (Maximum 320)
	page: <int>,  // What page number to be queryed
})
```

Returns
```
{
	posts: [
		<type::post>
	]
}
```

Example
```js
async() => {
	try {
		var result = await <api>.getPostsByTag({
			tags: [
				"rating:safe",
				"male"
			],
		})
		console.log(result)
	} catch (e) {
		console.error(e)
	}
}
```

### getPostsByTags
Usage
```js
<api>.getPostsByTags({
	tags: <array>,// Each object will be queryed individually
	limit: <int>, // Maximum ammount of posts per query (Maximum; tags.length*limit)
	page: <int>,  // What page number to be queryed
})
```

Returns
```
{
	posts: [
		<type::post>
	]
}
```

Example
```js
async() => {
	try {
		var result = await <api>.getPostsByTags({
			tags: [
				"rating:safe",
				"male"
			],
		})
		console.log(result)
	} catch (e) {
		console.error(e)
	}
}
```

### getPostByID
Usage
```js
<api>.getPostByID(<int>)
```

Returns
```
{
	<type::post>
}
```

Example
```js
async() => {
	try {
		var result = await <api>.getPostByID(2581450)
		console.log(result)
	} catch (e) {
		console.error(e)
	}
}
```

## Types

### Post
```js
{
	id: <int>, // e621 Post ID
	created_at: <string>, // e621 timestamp string of when the post was created
	updated_at: <string>, // e621 timestamp string of when the post was modifiyed/updated
	file: {
		width: <int>,  // Post Width
		height: <int>, // Post Height
		ext: <string>, // File Extension
		size: <string>,// File Size in Bytes
		md5: <string>, // MD5 of the file
		url: <string>, // URL of file
	},
	sample: {
		has: <boolean>,// If the post has a sample
		width: <int>,  // Post Width
		height: <int>, // Post Height
		url: <string>, // URL of file
	},
	preview: {
		width: <int>,  // Post Width
		height: <int>, // Post Height
		url: <string>, // URL of file
	},
	score: {
		up: <int>,	// How many time the post has been upvoted
		down: <int>,// How many times the post has been downvoted
		total: <int>// Total vote count
	},
	tags: <type::tag>,
	locked_tags: <array>, // A JSON array of tags that are locked on the post.
	change_seq: <int>, // An ID that increases for every post alteration on E6
	flags: <type::flags>,
	rating: <string>, // Can be 'e' (explicit), 'q' (questionable), or 's' (safe)
	fav_count: <int>,
	sources: <array>, // An array of where the image is from.
	pools: <array>, // An array of pools that this post exists in.
	relationships: <type::relationship>,
	approver_id: <int>, // UserID of the person that approved this post
	uploader_id: <int>, // UserID of the person that uploaded this post
	description: <string>, // Post Description, Each line seperated with '\n'
	is_favorited: <boolean>, // Is the post favorited
	duration: <int>, // If this is not a video the object will be 'null'
	vote: <class::vote>,
	favorite: <class::favorite>,
	rawResponse: <Object> // HTTP response from axios
}
```

### Pool
```js
{
	id: <int>,
	name: <string>,
	created_at: <string>,
	updated_at: <string>,
	creator_id: <int>,
	description: <string>,
	is_active: <boolean>,
	category: <string>, // 'series' or 'collection'
	is_deleted: <boolean>,
	post_ids: <Array>,
	creator_name: <string>,
	post_count: <int>,
}
```

### Tags
```js
{
	general: <array>,
	species: <array>,
	character: <array>,
	artist: <array>,
	invalid: <array>,
	lore: <array>,
	meta: <array>
}
```

### Relationships
```js
{
	parent_id: <int>, // Parent Posts ID, if it has one
	has_children: <boolean>, // If the post has children
	children: <array>, // Array of PostID's of this posts children.
}
```

### Flags
```js
{
	pending: <boolean>,
	flagged: <boolean>,
	note_locked: <boolean>,
	status_locked: <boolean>,
	rating_locked: <boolean>,
	deleted: <boolean>,
}
```