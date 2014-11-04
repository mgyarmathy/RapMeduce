var Crawler = require('crawler');
var Set = require('collections/set');
var lineReader = require('line-reader');

function Lyric(artist, song, line) {
	this.artist = artist;
	this.song = song;
	this.line = line;
}

var c = new Crawler({

'callback': function(error, result, $) {
	if ($('#songLyricsDiv').length) {
		var songInfo = $('.pagetitle h1').text().replace(' Lyrics','').split(' - ');
		var artist = songInfo[0];
		var song = songInfo[1];
		var lines = $('#songLyricsDiv').text().split('\n');
		var formatted_lines = [];
		for (var i = 0; i<lines.length; i++) {
			lines[i] = lines[i].replace('\r', '');
			// filter out a lot of junk lines
			if (lines[i].length > 0 && 
				lines[i].split(' ').length > 1 &&
				lines[i].split(' ')[0].toLowerCase() != "verse" && 
				lines[i].charAt(0) != '[') {
				formatted_lines.push(lines[i]);
			}
		}
		var s = new Set(formatted_lines);
		s.forEach(function(lyric){
			console.log(JSON.stringify(new Lyric(artist, song, lyric)));
		});
	} else if ($('.tracklist').length){
		$($('.tracklist').get(0)).find('td a').each(function() {
			//console.log('adding to queue: '+$(this).attr('href'));
			c.queue($(this).attr('href'));
		});
	}
},
'onDrain': function() { process.exit(0) }
});

// Queue just artist URLS from -- http://en.wikipedia.org/wiki/List_of_hip_hop_musicians
lineReader.eachLine('../data/rap-artists-test.txt', function(line, last) {
	var artistUrl = 'http://www.songlyrics.com/'+line.toLowerCase().split(' ').join('-')+'-lyrics/';
	//console.log(artistUrl);
	c.queue({uri: artistUrl, priority: 6});
});
