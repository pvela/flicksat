var everyauth = require('everyauth');
var https = require('https');
//var user = require('../il/desktop_browser/il_user');
var Promise = everyauth.Promise;

module.exports = function Server(expressInstance, siteConf) {
	everyauth.debug = siteConf.debug;
	//everyauth.everymodule.userPkey('email');
    /*everyauth.everymodule.findUserById( function (id, callback) {
    	var oauthprov = id.substr(0,id.indexOf('-'));
    	var oauthid = id.substr(id.indexOf('-')+1);
    	user.findByOauthId(oauthprov, oauthid , function (err, userObj) {
	    	callback(err, userObj);
    	});
	});*/
	everyauth.everymodule.handleLogout( function (req, res) {
		delete req.session.user;
		req.logout();
		res.writeHead(303, { 'Location': this.logoutRedirectPath() });
		res.end();
	});
	/*everyauth.everymodule.sendResponse(function(res) {
        console.log('##### sendResponse custom step called #####');
        //build the backbone object here if the user id logged in
        this._super();
    });*/
	// Facebook
	if (siteConf.external && siteConf.external.facebook) {
		everyauth.facebook
		.appId(siteConf.external.facebook.appId)
		.appSecret(siteConf.external.facebook.appSecret)
		.findOrCreateUser(function (session, accessToken, accessTokenExtra, facebookUserMetaData) {
				//var promise = this.Promise();
		      	//user.find(facebookUserMetaData.id, 'facebook', facebookUserMetaData, promise);
		      	//return promise;
		      	//console.log(facebookUserMetaData);
		      	return facebookUserMetaData
			})
		.redirectPath('/search');
	}

	// Twitter
	if (siteConf.external && siteConf.external.twitter) {
		everyauth.twitter
		.myHostname(siteConf.uri)
		.consumerKey(siteConf.external.twitter.consumerKey)
		.consumerSecret(siteConf.external.twitter.consumerSecret)
		.findOrCreateUser(function (session, accessToken, accessSecret, twitterUser) {
			/*user.findByOauthId(twitterUser.id,'twitter',function(err, user) {
				if (err) {
					return false;
				} else {
					if (user) {
						//var promise = this.Promise());
						//promise.fulfill(user);
						return user;
					} else {
						console.log('user not registered, go thru registration wizard');
					}
				}
			});*/
			//console.log(twitterUser);
			return twitterUser;
		  })
		.redirectPath('/search');
	}

	// Github
	if (siteConf.external && siteConf.external.github) {
		everyauth.github
		.myHostname(siteConf.uri)
		.appId(siteConf.external.github.appId)
		.appSecret(siteConf.external.github.appSecret)
		.findOrCreateUser(function (session, accessToken, accessTokenExtra, githubUser) {return true;})
		.redirectPath('/');
	}
	// linkedin
	if (siteConf.external && siteConf.external.linkedin) {
		everyauth.linkedin
	  .consumerKey(siteConf.external.linkedin.apiKey)
	  .consumerSecret(siteConf.external.linkedin.apiSecret)
	  .findOrCreateUser( function (sess, accessToken, accessSecret, linkedinUser) {
	  	console.dir(linkedinUser);
	    //return usersByLinkedinId[linkedinUser.id] || (usersByLinkedinId[linkedinUser.id] = addUser('linkedin', linkedinUser));
	    return true;
	  })
	  .redirectPath('/');
	}

	// Google
	if (siteConf.external && siteConf.external.google) {
		everyauth.google
  		.appId(siteConf.external.google.clientId)
  		.appSecret(siteConf.external.google.clientSecret)
  		.scope('https://www.google.com/m8/feeds/')
  		.findOrCreateUser( function (sess, accessToken, extra, googleUser) {
  			console.dir(googleUser);
  		  googleUser.refreshToken = extra.refresh_token;
  		  googleUser.expiresIn = extra.expires_in;
   		 	//return usersByGoogleId[googleUser.id] || (usersByGoogleId[googleUser.id] = addUser('google', googleUser));
   		 	return true;
 		 })
  		.redirectPath('/');
  	}
  

	if (siteConf.external && siteConf.external.password) {
		everyauth.password
  		.getLoginPath('/login') // Uri path to the login page
	    .postLoginPath('/loginp') // Uri path that your login form POSTs to
	    .loginView('index')
	    .authenticate( function (login, password) {
			// Either, we return a user or an array of errors if doing sync auth.
			// Or, we return a Promise that can fulfill to promise.fulfill(user) or promise.fulfill(errors)
			// `errors` is an array of error message strings
			//
			// e.g., 
			// Example 1 - Sync Example
			// if (usersByLogin[login] && usersByLogin[login].password === password) {
			//   return usersByLogin[login];
			// } else {
			//   return ['Login failed'];
			// }
			//
			// Example 2 - Async Example
			// var promise = this.Promise()
			// YourUserModel.find({ login: login}, function (err, user) {
			//   if (err) return promise.fulfill([err]);
			//   promise.fulfill(user);
			// }
			// return promise;
			console.log('trying login for '+login );
			
			return ['Login Success'];
		  })
	    .loginSuccessRedirect('/') // Where to redirect to after a login

			// If login fails, we render the errors via the login view template,
			// so just make sure your loginView() template incorporates an `errors` local.
			// See './example/views/login.jade'
		
		  .getRegisterPath('/register') // Uri path to the registration page
		  .postRegisterPath('/register') // The Uri path that your registration form POSTs to
		  .registerView('index')
		  .validateRegistration( function (newUserAttributes) {
			// Validate the registration input
			// Return undefined, null, or [] if validation succeeds
			// Return an array of error messages (or Promise promising this array)
			// if validation fails
			//
			// e.g., assuming you define validate with the following signature
			// var errors = validate(login, password, extraParams);
			// return errors;
			//
			// The `errors` you return show up as an `errors` local in your jade template
		  })
		  .registerUser( function (newUserAttributes) {
			// This step is only executed if we pass the validateRegistration step without
			// any errors.
			//
			// Returns a user (or a Promise that promises a user) after adding it to
			// some user store.
			//
			// As an edge case, sometimes your database may make you aware of violation
			// of the unique login index, so if this error is sent back in an async
			// callback, then you can just return that error as a single element array
			// containing just that error message, and everyauth will automatically handle
			// that as a failed registration. Again, you will have access to this error via
			// the `errors` local in your register view jade template.
			// e.g.,
			// var promise = this.Promise();
			// User.create(newUserAttributes, function (err, user) {
			//   if (err) return promise.fulfill([err]);
			//   promise.fulfill(user);
			// });
			// return promise;
			//
			// Note: Index and db-driven validations are the only validations that occur 
			// here; all other validations occur in the `validateRegistration` step documented above.
		  })
		  .registerSuccessRedirect('/'); // Where to redirect to after a successful registration
	}
  
	everyauth.helpExpress(expressInstance);

	// Fetch and format data so we have an easy object with user data to work with.
	function normalizeUserData() {
		function handler(req, res, next) {
			if (req.session && !req.session.user && req.session.auth && req.session.auth.loggedIn) {
				var user = {};
				if (req.session.auth.github) {
					user.image = 'http://1.gravatar.com/avatar/'+req.session.auth.github.user.gravatar_id+'?s=48';
					user.name = req.session.auth.github.user.name;
					user.id = 'github-'+req.session.auth.github.user.id;
				}
				if (req.session.auth.twitter) {
					console.dir(req.session.auth.twitter);
					user.image = req.session.auth.twitter.user.profile_image_url;
					user.name = req.session.auth.twitter.user.name;
					user.oauthprovider='twitter';
					user.oauthid=req.session.auth.twitter.user.id_str;
					user.id = 'twitter-'+req.session.auth.twitter.user.id_str;
				}
				if (req.session.auth.google) {
					console.dir(req.session.auth.google);
					user.image = req.session.auth.google.user.profile_image_url;
					user.name = req.session.auth.google.user.name;
					user.id = 'google-'+req.session.auth.google.user.id_str;
				}
				if (req.session.auth.linkedin) {
					console.dir(req.session.auth.linkedin);
					user.image = req.session.auth.linkedin.user.profile_image_url;
					user.name = req.session.auth.linkedin.user.name;
					user.id = 'linkedin-'+req.session.auth.linkedin.user.id_str;
				}
				if (req.session.auth.facebook) {
					console.dir(req.session.auth.facebook);
					user.image = req.session.auth.facebook.user.picture;
					user.name = req.session.auth.facebook.user.name;
					user.id = 'facebook-'+req.session.auth.facebook.user.id;

					// Need to fetch the users image...
					https.get({
						'host': 'graph.facebook.com'
						, 'path': '/me/picture?access_token='+req.session.auth.facebook.accessToken
					}, function(response) {
						user.image = response.headers.location;
						req.session.user = user;
						next();
					}).on('error', function(e) {
						req.session.user = user;
						next();
					});
					return;
				}
				
				req.session.user = user;
			}
			next();
		}
		return handler;
	}

	return {
		'middleware': {
			'auth': everyauth.middleware
			, 'normalizeUserData': normalizeUserData
		}
	};
};