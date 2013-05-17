/**
* This hook proxies the functionality of jQuery's $(document).ready event
* 
* @param  {String} hook_name        The name of the hook
* @param  {Object} context          Object containing information about the context
*/
exports.documentReady = function(hook_name, context) {
	$.getScript('/javascripts/lib/ep_embedmedia/static/js/jquery.oembed.js');		
};

/**
* This hook is called during the creation of the editor HTML.
* 
* @param {String}   hook_name       The name of the hook
* @param {Object}	args			Arguments
* @param {Function} callback		The callback function
*/
exports.aceInitInnerdocbodyHead = function(hook_name, args, cb) {
	args.iframeHTML.push('<link rel="stylesheet" type="text/css" href="/static/plugins/ep_embedmedia/static/css/ace.css"/>');
	return cb();
};

/**
* This hook is called during the attribute processing procedure, and should be used to translate key, 
* value pairs into valid HTML classes that can be inserted into the DOM.
* 
* @param  {String} name            The name of the hook
* @param  {Object} context         Object containing information about the context
*/
exports.aceAttribsToClasses = function(hook_name, args, cb) {
	if (args.key == 'embedMedia' && args.value != "")
		return cb(["embedMedia:" + args.value]);
};

/**
 * This hook is called for elements in the DOM that have the "lineMarkerAttribute" set. 
 * You can add elements into this category with the aceRegisterBlockElements hook.
*/
exports.aceDomLineProcessLineAttributes = function(hook_name, context, cb) {
	console.log('aceDomLineProcessLineAttributes');
};

/**
* This hook is called for any line being processed by the formatting engine, 
* unless the aceDomLineProcessLineAttributes hook returned true, in which case this hook is skipped.
* 
* @param  {String} name            The name of the hook
* @param  {Object} context         Object containing information about the context
*/
exports.aceCreateDomLine = function(hook_name, args, cb) {
	if (args.cls.indexOf('embedMedia:') > -1) {
		var html = unescape(args.cls.split('embedMedia:')[1]);
		
		console.log(hook_name);
		console.log(args);
		console.log(html);	
		
		return cb([{
			cls: 'oembed',
			extraOpenTags: '<span class="embedMedia"><span class="media">' + html + '</span><span class="character">', 
			extraCloseTags: '</span></span>'
		}]);
	} else {
		console.log('aceCreateDomLine ignoring');
		return cb();
	}
};

var wrap = function (obj) {
	var wrapper = $("<div></div>");
	wrapper.append(obj);
	return wrapper;
}

var filter = function (node) {
	node = $(node);
	if (node.children().length) {
		node.children().each(function () { filter(this); });
	}
	if (!node.is("iframe,object,embed,param")) {
		node.replaceWith(node.children().clone());
	}
}

var parseUrlParams = function (url) {
	var res = {};
	url.split("?")[1].split("&").map(function (item) {
		item = item.split("=");
		res[item[0]] = item[1];
	});
	return res;
}

exports.sanitize = function (inputHtml) {
	// Monkeypatch the sanitizer a bit, adding support for embed tags and fixing broken param tags
	
	html4.ELEMENTS.embed = html4.eflags.UNSAFE;
	html4.ELEMENTS.param = html4.eflags.UNSAFE; // NOT empty or we break stuff in some browsers...
	
	return html.sanitizeWithPolicy(inputHtml, function(tagName, attribs) {
		if ($.inArray(tagName, ["embed", "object", "iframe", "param"]) == -1) {
			return null;
		}
		return attribs;
	});
}
