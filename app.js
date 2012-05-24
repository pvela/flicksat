var connect = require('connect');
var express = require('express');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');
var siteConf = require('./lib/getConfig');
var app = module.exports = express.createServer();
var utils = require('./utils/utils');
var movieModelDef = require('./models/models').Movie;
var netflix = require('./netflix');
//var RedisStore = require('connect-redis')(express);
var sessionStore = null;
// Setup socket.io server
//var socketIo = new require('./lib/socket-io-server.js')(app, sessionStore);
var authentication = new require('./lib/authentication.js')(app, siteConf);
//var assetsMiddleware = assetManager(assetsSettings);
var viewPath = 'desktop_browser/';
app.listen(siteConf.port, null);
app.configure(function() {
	app.set('view engine', 'jade');
	app.set('views', __dirname+'/views');
	app.set('view options',{layout:false});
	//app.set('view options', { pretty: false });
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	//app.use(assetsMiddleware);
	app.use(express.session({
		'store': sessionStore
		, 'secret': siteConf.sessionSecret
	}));
	app.use(authentication.middleware.auth());
	app.use(authentication.middleware.normalizeUserData());
	//app.use(express.session({'secret': 'flipsat', store: new RedisStore }));
	app.use(express.logger({format: ':response-time ms - :date - :req[x-real-ip] - :method :url :user-agent / :referrer'}));
	app.use(express['static'](__dirname+'/public', {maxAge: 86400000}));

});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});
// Template helpers
app.dynamicHelpers({
	'session': function(req, res) {
		return req.session;
	}
});


// application related includes

//require('./il/desktop_browser/il_user')(app);

//app.put('/',user.put);

app.get('/', function(req, res){
    res.render(viewPath+'index', {title: 'flicksat'});
});

app.get('/signup', function(req, res){
    res.render(viewPath+'signup', {title: 'flicksat'});
});

app.post('/search', function(req,res) {
	console.log('querying for movie'+req.body.moviename);
	netflix.search(req.body.moviename, function(err, movies) {
		console.log(movies.models.length + 'movies found');
		res.render(viewPath+'/results',{"movies" : movies.models});	
	});
});

app.post('/addtoq', function(req,res) {
	console.log('adding movie'+req.body.titleid);
	netflix.addtoq(req.body.titleid, function(err) {
		res.send({response:err});	
	});
});

app.get('/results', function(req,res) {
	res.render(viewPath+'/results', {title: 'Flicksat'});
});


app.get('/search', function(req,res) {
	res.render(viewPath+'/search', {title: 'Flicksat'});
});

// Error handling
app.error(function(err, req, res, next){
	// Log the error to Airbreak if available, good for backtracking.
	console.log(err);
	if (err instanceof NotFound) {
		res.render('errors/404');
	} else {
		res.render('errors/500');
	}
});
function NotFound(msg){
	this.name = 'NotFound';
	Error.call(this, msg);
	Error.captureStackTrace(this, arguments.callee);
}

console.log('Running in '+(process.env.NODE_ENV || 'development')+' mode @ '+siteConf.uri);
