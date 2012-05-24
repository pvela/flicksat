var nodeflix = require('nodeflix');
var movieModelDef = require('./models/models').Movie;
var moviesCollectionDef = require('./models/models').Movies;
var n = new nodeflix({
    consumer_key:       '72uyjmbecka47mhbejn7fchf',
    consumer_secret:    'n9CtM9AWTZ'
    ,
    oauth_token:        'BQAJAAEDEJXR9zPkFMbJnAVLxoBRelMwLDeYei8g1xJpRU2EDU5OJ7qsAUTHHfNPMp47RsGvteW0YE6bRBCeVnH1cSu4ndsX',     // optional, for signed user requests
    oauth_token_secret: 'gRKDdGGnZBJn',     // optional, for signed user requests
    user_id:            'BQAJAAEDEBDH7sx7Bt4tcKOJYQj_h38w9zFxm0RJpSxNyo1q-Jdmnw6jWY9Tmu_U3DWsfQjiQCEqfT0yxjTPp5wEycVHBIk_'      // optional, for signed user requests
});
//oauth_token=x5amqsu4nqpm26wmvhmxz2mc&oauth_token_secret=Yd97BMPjyhxx&application_name=flicksat.com&login_url=https%3A%2F%2Fapi-user.netflix.com%2Foauth%2Flogin%3Foauth_token%3Dx5amqsu4nqpm26wmvhmxz2mc


//oauth_token=kfxd4rytsdev8vjt9xa8uqx4&oauth_token_secret=EHUuugEmVUgf&application_name=flicksat.com&login_url=https%3A%2F%2Fapi-user.netflix.com%2Foauth%2Flogin%3Foauth_token%3Dkfxd4rytsdev8vjt9xa8uqx4

//oauth_token=BQAJAAEDEJXR9zPkFMbJnAVLxoBRelMwLDeYei8g1xJpRU2EDU5OJ7qsAUTHHfNPMp47RsGvteW0YE6bRBCeVnH1cSu4ndsX&user_id=BQAJAAEDEBDH7sx7Bt4tcKOJYQj_h38w9zFxm0RJpSxNyo1q-Jdmnw6jWY9Tmu_U3DWsfQjiQCEqfT0yxjTPp5wEycVHBIk_&oauth_token_secret=gRKDdGGnZBJn

// get user information (colon prefixed strings will be replaced with matching config option(s) for convenience e.g. ':user_id')
exports.getUserInfo = function(cb) {
	n.get('/users/:user_id', function() {
    cb(this.toJSON());
})}

/*
// lookup something from the people catalog
n.get('/catalog/people', { term: 'DeNiro' }, function(data) {
    console.log(data);
});

// delete something from a user's instant queue
n.delete('/users/:user_id/queues/instant/saved/60022048', function(data) {
    if(data.status && data.status.status_code == 200) {
        console.log('Item successfully deleted!');
    }
});
*/
// add something to a user's instant queue
//http://api.netflix.com/
exports.addtoq = function(title, cb) {
	if (title.indexOf('http://api.netflix.com/') >-1) {
		title = title.substring(22); //22 or 45
	}
	console.log(title);
	n.post('/users/:user_id/queues/instant', { title_ref: title}, function(data) {
		console.dir(this);
	    if(this.data.status && this.data.status.message == 'success') {
    	    console.log('Item successfully added to instant queue!')
    	    cb("This movie is added to queue successfully");
	    } else {
	    	cb(this.data.status && this.data.status.message?this.data.status.message:'This movie is not available for flicking');
	    }
	});
}

/*
// also supports simple "deferred-like" (not a true deferred right now) syntax
n.get('/catalog/people', { term: 'Brad Pitt'}).end(function() {
    console.log(this.toJSON());
});

// chaining is all the rage these days
n.get('/catalog/people', { term: 'Bruce Willis' }).end(function() {
    console.log(this.toJSON());
});
*/
exports.search = function(title,cb) {
	n.get('/catalog/titles', { term: title}).end(function() {
		var netflixMovies = this.toJSON().catalog_titles.catalog_title;
		var movies = new moviesCollectionDef([]);
		if (netflixMovies && netflixMovies.length>0) {
			console.dir(this.toJSON().catalog_titles.catalog_title[0].title.regular);
			console.dir(this.toJSON().catalog_titles.catalog_title[0].box_art.large);
			for(var i=0;i<netflixMovies.length;i++) {
				var netflixMovie = netflixMovies[i];
				var movie = new movieModelDef(netflixMovie);
                movies.add(movie);
	        }
		} 
		cb(null,movies);
	});
}

/*exports.search('voyager', function(err,movies) {
	console.dir(movies);
});*/
/*n.get('/catalog/titles/series/70158331').end(function() {
    console.log(this.toJSON());
});*/
