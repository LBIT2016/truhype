import axios from "axios";

export default {
	user: {
		login: credentials =>
			axios.post("/api/users/login", { credentials }).then(res => res.data.user),
		signup: () => 
			axios.post("/api/users").then(res => res.data.user),
		setUserData: data =>
			axios.post("/api/users/setUserData", { data }).then(res => res.data.user),
		getlocation: () =>
			axios.post("/api/users/getlocation").then(res => res.data.user),
		getUsername: () =>
			axios.post("/api/users/getUsername").then(res => res.data.username),
		getKey: () =>
			axios.post("/api/users/getKey").then(res => res.data.key),
		regenKey: () =>
			axios.post("/api/users/regenKey").then(res => res.data.key),
		getPosts: (per, page) =>
			axios.post(`/api/users/getPosts/${per}/${page}`).then(res => res.data.posts),
		deletePosts: () =>
			axios.post("/api/users/deletePosts").then(res => res.data.success),
		getActivity: (per, page) =>
			axios.post(`/api/users/getActivity/${per}/${page}`).then(res => res.data.activity),
		getAnalytics: () =>
			axios.post("/api/users/getAnalytics").then(res => res.data.analytics),
		updatePostsSeen: postId =>
			axios.post("/api/users/updatePostsSeen", { postId }).then(res => res.data.analytics),
		gotDetails: sessionId =>
			axios.post("/api/users/checkDetails", { sessionId }).then(res => res.data.success)
	},
	locations: {
		fetchCountries: () =>
			axios.post("/api/locations/countries").then(res => res.data.countries),
		fetchStates: country => 
			axios.post("/api/locations/states/"+country).then(res => res.data.states),
		fetchCities: (country, state) =>
			axios.post("/api/locations/cities/"+country+"/"+state).then(res => res.data.cities)
	},
	images: {
		upload_image: img =>
			axios.post("/api/images/upload", { img }).then(res => res.data.imageid),
		fetch_image: imgid =>
			axios.get("/api/images/image", { imgid }).then(res => res.data.image)
	},
	posts: {
		upload_post: post =>
			axios.post("/api/posts/insert", { post }).then(res => res.data.post),
		fetchPostById: id =>
			axios.post("/api/posts/findbyid", { id }).then(res => res.data.post),
		fetchLocalPosts: () =>
			axios.post("/api/posts/fetchLocalPosts").then(res => res.data.posts),
		fetchLocalPostsByFilter: (filter, per, page, category, isAltLoc, loc) =>
			axios.post(
				`/api/posts/fetchLocalPostsByFilter/${per}/${page}`, 
				{ filter, category, isAltLoc, loc }
			).then(res => res.data.posts),
		fetchGlobalPostsByFilter: (filter, per, page, category) =>
			axios.post(
				`/api/posts/fetchGlobalPostsByFilter/${per}/${page}`, 
				{ filter, category }
			).then(res => res.data.posts),
		fetchPostsBySearchFilter: (filter, per, page, country, state, city, hashtag, category, textquery) =>
			axios.post(
				`/api/posts/fetchPostsBySearchFilter/${per}/${page}`, 
				{ filter, country, state, city, hashtag, category, textquery }
			).then(res => res.data.posts),
		insertComment: (postId, commenttext) => 
			axios.post('/api/posts/insertComment', { postId, commenttext }).then(res => res.data.comment),
		getAllComments: (postId, per, page) =>
			axios.post(`/api/posts/allComments/${per}/${page}`, { postId }).then(res => res.data.comments),
		getCommentsCount: postId => 
			axios.post("/api/posts/getCommentsCount/", { postId }).then(res => res.data.comments_count),
		insertReport: (postId, reason) =>
			axios.post("/api/posts/insertReport", { postId, reason }).then(res => res.data.success),
		fetchReportedPostsByFilter: (per, page, category) =>
			axios.post(`/api/posts/fetchReportedPostsByFilter/${per}/${page}`, { category }).then(res => res.data.posts),
		deletePost: id =>
			axios.post("/api/posts/deletePost", { id }).then(res => res.data.success)
	},
	comments: {
		getCommentVotes: id => 
			axios.post("/api/comments/getCommentVotes", { id }).then(res => res.data.success)
	},
	others: {
		fetchCategories: () =>
			axios.post("/api/categories").then(res => res.data.categories),
		addCategory: category =>
			axios.post("/api/categories/insert", { category }).then(res => res.data.category),
		updateCategory: (oldC, newC) =>
			axios.post("/api/categories/update", { oldC, newC }).then(res => res.data.success),
		deleteCategory: category =>
			axios.post("/api/categories/delete", { category }).then(res => res.data.success),
		insertfeedback: feedback =>
			axios.post("/api/feedbacks/insert", { feedback }).then(res => res.data.success),
		getFeedbacks: (per, page) =>
			axios.post(`/api/feedbacks/fetch/${per}/${page}`).then(res => res.data.feedbacks),
		insertsurvey: survey =>
			axios.post("/api/surveyresponses/insert", { survey }).then(res => res.data.success),
		getsurveys: (per, page) =>
			axios.post(`/api/surveyresponses/fetch/${per}/${page}`).then(res => res.data.surveys),
		getAns1: () =>
			axios.post("/api/surveyresponses/getansone").then(res => res.data.ans),
		getAns2: () =>
			axios.post("/api/surveyresponses/getanstwo").then(res => res.data.ans),
		fetchHashtags: () =>
			axios.post("/api/hashtags/topeight").then(res => res.data.hashtags),
		fetchHashtagsByKeyword: keyword =>
			axios.post("/api/hashtags", { keyword }).then(res => res.data.hashtags),
		addHashtag: hashtag =>
			axios.post("/api/hashtags/insert", { hashtag }).then(res => res.data.hashtags)
	},
	admins: {
		login: credentials =>
			axios.post("/api/admins/login", { credentials }).then(res => res.data.admin),
		change_password: data =>
			axios.post("/api/admins/change_password", { data }).then(res => res.data.admin)
	},
	adposts: {
		upload_adpost: adpost =>
			axios.post("/api/adposts/insert", { adpost }).then(res => res.data.post),
		fetchAdPosts: (per, page) =>
			axios.post(
				`/api/adposts/fetchAdPosts/${per}/${page}`
			).then(res => res.data.posts),
		fetchAdPostsForAdmin: (per, page) =>
			axios.post(
				`/api/adposts/fetchAdPostsForAdmin/${per}/${page}`
			).then(res => res.data.posts),
		insertComment: (postId, commenttext) => 
			axios.post('/api/adposts/insertComment', { postId, commenttext }).then(res => res.data.comment),
		getAllComments: (postId, per, page) =>
			axios.post(`/api/adposts/allComments/${per}/${page}`, { postId }).then(res => res.data.comments),
		getCommentsCount: postId => 
			axios.post("/api/adposts/getCommentsCount/", { postId }).then(res => res.data.comments_count),
		fetchAdPostById: id =>
			axios.post("/api/adposts/findbyid", { id }).then(res => res.data.post),
		insertReport: (postId, reason) =>
			axios.post("/api/adposts/insertReport", { postId, reason }).then(res => res.data.success),
		deleteAdPost: id =>
			axios.post("/api/adposts/deleteAdPost", { id }).then(res => res.data.success)
	},
	adStatistics: {
		fetchTotalNoAccounts: () =>
			axios.post("/api/adStatistics/fetchTotalNoAccounts").then(res => res.data.total_acc),
		fetchNoAccounts: (country, state, city) =>
			axios.post("/api/adStatistics/fetchNoAccounts", { country, state, city }).then(res => res.data.accounts),
		fetchStatsByCountry: country =>
			axios.post("/api/adStatistics/fetchStatsByCountry", { country }).then(res => res.data.countryStats),
		fetchStatsByState: (country, state) =>
			axios.post("/api/adStatistics/fetchStatsByState", { country, state }).then(res => res.data.stateStats)			
	}
}