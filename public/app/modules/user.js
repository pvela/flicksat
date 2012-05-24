define([
	"namespace",

	//	Libs
	"use!backbone"

	//	Modules

	//	Plugins
],

function(namespace,	Backbone)	{

	var	MegaMayga	=	namespace.module();

	//	Dependencies
	//var	Message	=	namespace.module("message");
	//var Contact = namespace.module("contact");
	var User = namespace.module("user");
	//var Group = namespace.module("group");
	
	//	Contact	extendings
	MegaMayga.Model	=	Backbone.Model.extend({	
	defaults:	{
		
	},
	
		initialize:	function()	{
	//	Add	a	nested	messages	collection
	//this.set({	messages:	new	Message.List()	});
		}
	});
	// Maybe used for reseller screens
	MegaMayga.List	=	Backbone.Collection.extend({
		model:	MegaMayga.Model
		
	});
	MegaMayga.Router	=	Backbone.Router.extend({
		routes:	{
		"help":	"help",	
		"search/:query":	"search",	
		"search/:query/p:page":	"search"	
		},

		help:	function()	{
	
		},

		search:	function(query,	page)	{

		}
	});

	//	Required,	return	the	module	for	AMD	compliance
	return	MegaMayga;

});
