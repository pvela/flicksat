
// prabhus credentials
var key="md7nq6t2rdnkecef6e5wyfmx";
var secret="jJBUZQRzPP";
var sig="75432e4eae7d5342456c509ee2a7eeaa";

/*//Lou's credentials
var key = "gr4ckpg6hf6pxxyjbk23d3kf";
var secret="GwzKt5aEjV";
var sig = "6d03c79478ebe6eb8d36852567d8572b";
*/
var http = require('http');
var base_url = "http://api.rovicorp.com/search/v2.1/amgvideo/search?"
var host = "api.rovicorp.com";
var port = "80";

var ROVI_END_POINT = {'uri':'/data/v1/movie/synopsis','host':'api.rovicorp.com','port':80};
//http://api.rovicorp.com/search/v2.1/amgvideo/search?apikey=md7nq6t2rdnkecef6e5wyfmx&sig=02430dc7bec638be0dbec9f7b7edddbc&query=mark+harmon& &entitytype=credit&include=moviebio
//http://api.rovicorp.com/data/v1/movie/info?movie=fast+and+furious&country=US&language=en&format=json&apikey=md7nq6t2rdnkecef6e5wyfmx&sig=dc0346a60f8d29aaadc12fbdd3cac16a
//http://api.rovicorp.com/data/v1/movie/synopsis?movie=fast+and+furious&country=US&language=en&format=json&apikey=md7nq6t2rdnkecef6e5wyfmx&sig=107aa43b7294c6608aae557c99ddc718
exports.getMovieInfo = function(title,cb) {
	var post=http.createClient(ROVI_END_POINT.port,ROVI_END_POINT.host);
	var request=post.request('GET',ROVI_END_POINT.uri+'?country=US&language=en&format=json&apikey='+key+'&sig='+sig+'&movie='+encodeURIComponent(title),{'host':ROVI_END_POINT.host,'port':ROVI_END_POINT.port});
	//request.write();
	request.end();
	request.on('response',function(response){ 
		response.setEncoding('utf8'); 
		var allresp="";
		response.on('data',function(chunk){ 
			console.log(chunk);
			allresp+=chunk;
		})
		response.on('end',function() {
			cb(allresp);
		});
	});
}
/*
exports.getMovieInfo('fast and furious', function(res){
//console.log(res);
//var res1 = res.substring(res.indexof("synopsis\":{\"text\":\"")+19,res.indexof(".\",\"author\""));
//console.log(res1);
//var res2 = res1.replace(']/g','\]');
//console.log(res2);
var response = JSON.parse(res);

console.log(response.synopsis.text);
});*/