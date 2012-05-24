define([
	"namespace",

	//	Libs
	"use!backbone"

	//	Modules

	//	Plugins
],

function(namespace,	Backbone)	{

	//	Create	a	new	module
	var	Contact	=	namespace.module();

	//	Dependencies
	//var	Message	=	namespace.module("message");
	
	//	Contact	extendings
	Contact.Model	=	Backbone.Model.extend({	
	defaults:	{
		"name":"New	Friends	Full	name",
		"phone":"Friends	Mobile	Number",
		"email":"Friends	email"
	},
	
		initialize:	function()	{
	//	Add	a	nested	messages	collection
	//this.set({	messages:	new	Message.List()	});
		}
	});
	Contact.List	=	Backbone.Collection.extend({
		model:	Contact.Model
		
	});
	Contact.Router	=	Backbone.Router.extend({
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

	//	This	will	fetch	the	tutorial	template	and	render	it.
	Contact.Views.singleview	=	Backbone.View.extend({
	tagName:	"li",
		className:	"view",
	initialize:	function(){
		this.model.bind("change",	_.bind(this.render,	this));
		/*_.bindAll(this,	"render");
		this.model.bind("change",	this.render)	
		$(this.el).html(this.template(this.model.toJSON()));*/
	},

	events:	{
	//"click	.icon":	"open",
	//"click	.button.edit":	"openEditDialog",
	//"click	.button.delete":	"destroy"
	},
	
	template:	_.template($("#item-template").html()),

	render:	function(done)	{
	var	view	=	this;
	console.log(this);
	console.log(this.template(this.model.toJSON()));
	$(this.el).html(this.template(this.model.toJSON()));
	//	Fetch	the	template,	render	it	to	the	View	element	and	call	done.
	/*namespace.fetchTemplate(this.template,	function(tmpl)	{
	view.el.innerHTML	=	tmpl();

	//	If	a	done	function	is	passed,	call	it	with	the	element
	if	(_.isFunction(done))	{
	done(view.el);
	}
	});*/
	done(view.el);
	}
	});

	//	Required,	return	the	module	for	AMD	compliance
	return	Contact;

});
