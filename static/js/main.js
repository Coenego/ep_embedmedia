// Properties
var padeditor = require('ep_etherpad-lite/static/js/pad_editor').padeditor;
var offset = 0;
var queue = [];
var results = [];

// Methods
$(document).ready(function() {

	$('#insertEmbedMedia').click(function(e) {
		$('#doEmbedMedia').prop({disabled: false});
		var module = $('#embedMediaModal');
		if (module.css('display') != 'none') {
			module.slideUp('fast');
		} else {
			module.slideDown('fast');
		}
	});

	$('#doEmbedMedia').click(function(e) {
		$('#doEmbedMedia').prop({disabled: true});
		var content = $('#embedMediaSrc')[0].value.split(/\n/);
		$.each(content, function(i) {
			var url = content[i];
			if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0) {
				addLinkToProcessList(url);
			}
			if(i == (content.length - 1)) processMediaLinks();
		});
	});
	
	$('#cancelEmbedMedia').click(function(e) {
		$('#doEmbedMedia').prop({disabled: false});
		$('#embedMediaModal').slideUp('fast');
	});
});

/**
 * Adds all the valid url's to a queue 
 * 
 * @param {String} url		The url 
*/
var addLinkToProcessList = function(url) {
	queue.push(url);
};

/**
 * Process all the links in the queue
*/
var processMediaLinks = function() {
	if (queue.length) {
		processLink(queue[0]);
	} else {
		queue = [];
		offset = 0;
		$('#embedMediaSrc').val('');
		$('#embedMediaModal').slideUp('fast');
		returnResults();
	}
};

/**
 * Process the link
 * 
 * @param {String}	url		The url
*/
var vPos = 0;
var hPos = 0;

var processLink = function(url) {
	var tempEl = document.createElement('div');
	$(tempEl).addClass('url:' + url);
	$(tempEl).oembed(url, {
		afterEmbed: function(e) {
			if (e.type != 'error'){
				var source = (e.code) ? escape(e.code) : '';
				results.push(padeditor.ace.callWithAce(function (ace) {
					rep = ace.ace_getRep();
					
					// 1. Replace the selection with the url
					console.log('pre replaceRange');
					console.log(rep.selStart);
					console.log(rep.selEnd);
					ace.ace_replaceRange(rep.selStart, rep.selEnd, 'E');
					console.log('post replaceRange');
					console.log(rep.selStart);
					console.log(rep.selEnd);
			
					console.log('pre performSelectionChange');
					console.log(rep.selStart);
					console.log(rep.selEnd);
					// 2. Select the url
					ace.ace_performSelectionChange(rep.selStart, [rep.selStart[0], rep.selStart[1] -1], false);
					console.log('post performSelectionChange');
					console.log(rep.selStart);
					console.log(rep.selEnd);
												
					// 3. Set the embedMedia attribute on the selected range  
					ace.ace_performDocumentApplyAttributesToRange(rep.selStart, rep.selEnd, [['embedMedia', source]]);
					console.log('post ace_performDocumentApplyAttributesToRange');
					console.log(rep.selStart);
					console.log(rep.selEnd);
					
					//4. Insert new line
					//ace.ace_doReturnKey();
					
				}, 'embedMedia'));
			} else {
				console.log('Error while fetching url with oembed');
			}
			queue.shift();
			processMediaLinks();
		}
	});
};

/**
 * Return the results 
*/
var returnResults = function() {
	$.each(results, function(i) {
		return results[i];
	});
};
