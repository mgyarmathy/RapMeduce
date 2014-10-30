var Crawler = require('crawler');
var Set = require('collections/set');

var onFetch = function(error, result, $) {
	if ($('#songLyricsDiv').length) {
		var lines = $('#songLyricsDiv').text().split('\n');
		var formatted_lines = [];
		for (var i = 0; i<lines.length; i++) {
			lines[i] = lines[i].replace('\r', '');
			if (lines[i].length > 0 && lines[i].charAt(0) != '[') formatted_lines.push(lines[i]);
		}
		console.log(new Set(formatted_lines).toArray());
	} else if ($('.tracklist').length){
		$($('.tracklist').get(0)).find('td a').each(function() {
			c.queue($(this).attr('href'));
		});
	}
};

var c = new Crawler({
'callback': onFetch,
'onDrain': function() { process.exit(0) }
});

// Queue just one URL, with default callback
c.queue("http://www.songlyrics.com/drake-lyrics/");