/**
 * This file has all user related business layer functions
*/

var userdb = require('../db/user_db').User;

module.exports = {

// function to authenticate user 
authenticate : function(email,password,cb){
	userdb.authenticate(email, password, function(err, user){
		cb(err,user);
	});
},

findById : function (id, cb) {
	userdb.load(id, function(err, user){
		cb(err,user);
	});
},

findByOauthId : function (oauthId, oauthProvider, cb) {
	userdb.findByOauthId(oauthId, oauthProvider,function(err, user){
		cb(err,user);
	});
},

findByUsername : function (username, oauthProvider, cb) {
	userdb.findByUsername(username, oauthProvider,function(err, user){
		cb(err,user);
	});
},

checkUserName : function (username, cb) {
	userdb.checkUserName(username,function(err, usernameavailable){
		cb(err,usernameavailable);
	});
},

findOrCreateUser : function (oauthId, oauthProvider, profile, promise) {
    userdb.findByProvider(oauthProvider, oauthId, function(err, users) {
        if(err) throw err;
        if(users.length > 0) {
            promise.fulfill(users[0]);
        } else {
            userdb.save({firstName:profile.firstname, lastName:profile.lastname, email:profile.email, phone:profile.phone,password:''}, function(err,userid) {
                if (err) throw err;
                promise.fulfill(userid);
            });
        }
    });
},
createUser : function (profile, cb) {
	console.log('Profile ');
	console.dir(profile);
	userdb.save(profile.attributes, function(err,userid) {
		if (err) { 
			cb(err,null); 
		} else {
			cb(null, userid);
		}
	});
}
 
}

/*module.exports.authenticate('tt@yahoo.com','test1', function(err,user) {
	console.log('err '+err);
	console.dir(err);
	console.dir(user);
});

module.exports.findById(3, function(err,user) {
	console.log('err '+err);
	console.dir(err);
	console.dir(user);
});
module.exports.findByUsername('tt@yahoo.com', function(err,user) {
	console.log('err '+err);
	console.dir(err);
	console.dir(user);
});*/