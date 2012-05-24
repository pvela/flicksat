var settings = {
	'sessionSecret': 'flicksat'
	, 'port': 9000
	, 'uri': 'http://flicksat.com:9000' // Without trailing /
	, 'debug': (process.env.NODE_ENV !== 'production')
	, 'external': {
                'facebook': {
                        appId: '311328235614970',
                        appSecret: 'd034af634de9f78011fe6dc7ec7ead8d'
                }
                , 'twitter': {
                        consumerKey: 'lOIGz8YwDZURlk10XgGdug',
                        consumerSecret: 'GOJcuEFdE2vI8DWYkj50Q7G2G0KJrHHVU9c6ikrHfjg'
                }
        }
};

if (process.env.NODE_ENV == 'production') {
	settings.uri = 'http://yourname.no.de';
	settings.port = process.env.PORT || 80; // Joyent SmartMachine uses process.env.PORT

	//settings.airbrakeApiKey = '0190e64f92da110c69673b244c862709'; // Error logging, Get free API key from https://airbrakeapp.com/account/new/Free
}
module.exports = settings;
