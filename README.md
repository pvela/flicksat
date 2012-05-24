This is the nodejs based portal project for flicksat

Techstack for portal :

Client :
Backbone for client side MVC (http://documentcloud.github.com/backbone/)
HTML5 Pushstate for moving between pages (https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history). Backbone has supprot for this so use backbone to handle pushstate
jade for view templating (http://jade-lang.com/)

Server :

Express with Connect for routing middleware and session management (http://expressjs.com/)
cradle for DB access to couch db (https://github.com/cloudhead/cradle)
cluster for server cluster control (http://learnboost.github.com/cluster/)
redis for interprocess pubsub and data sharing 
async library for flow control
Websockets pushing messages to client 
