var path = require('path'), 
    express = require('ep_etherpad-lite/node_modules/express'),
    eejs = require("ep_etherpad-lite/node/eejs");

exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_embedmedia/templates/editbarButtons.ejs", {}, module);
  return cb();
}

exports.eejsBlock_body = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_embedmedia/templates/modals.ejs", {}, module);
  return cb();
}

exports.eejsBlock_scripts = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_embedmedia/templates/scripts.ejs", {}, module);
  return cb();
}

exports.eejsBlock_styles = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_embedmedia/templates/styles.ejs", {}, module);
  return cb();
}

/**
* This hook reformats the string if it contains a oembed url.
* 
* @param  {String} name            The name of the hook
* @param  {Object} context         Object containing information about the context
*/
exports.getLineHTMLForExport = function(hook, context) {
	var retVal = '';
	console.log('getLineHTMLForExport');
	console.log(context);
	if (context.text.indexOf('http://') > -1 || context.text.indexOf('https://') > -1) {
		retVal = '<span class="oembed">' + escape(context.text) + '</span><br/>';
	} else {
		retVal = context.text + '<br/>';
	}
	return retVal;
}
