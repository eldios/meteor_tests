Template.postsList.helpers({
	hasMorePosts: function () {
		this.posts.rewind();
		return Router.current().postsLimit() == this.posts.count();
	}
});