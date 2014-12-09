var Lyric = function(artist, song, line, altLines) {
    var self = this;
    self.artist = ko.observable(artist);
    self.song = ko.observable(song);
    self.line = ko.observable(line);

    self.isUnoriginal = ko.computed(function() {
        return self.artist().length > 0;
    });

    // have to use JSON objects here instead of Lyric() to prevent infinite loop
    self.alternateLines = ko.observableArray(altLines);

    self.alternateLineUp = function(data, event) {
        if (self.alternateLines().length == 0) return;
        $(event.target).removeClass('animated fadeInUp fadeInDown');
        setTimeout(function() {
            self.alternateLines().push({artist: self.artist(), song: self.song(), line: self.line()})
            var lyric = self.alternateLines().shift();
            self.artist(lyric.artist);
            self.song(lyric.song);
            self.line(lyric.line);
            $(event.target).addClass('animated fadeInUp');
        },1);
    };

    self.alternateLineDown = function(data, event) {
        if (self.alternateLines().length == 0) return;
        $(event.target).removeClass('animated fadeInUp fadeInDown');
        setTimeout(function() {
            self.alternateLines().unshift({artist: self.artist(), song: self.song(), line: self.line()});
            var lyric = self.alternateLines().pop();
            self.artist(lyric.artist);
            self.song(lyric.song);
            self.line(lyric.line);
            $(event.target).addClass('animated fadeInDown');
        },1);
    };
}

function AppViewModel() {
    var self = this;

    self.lineSimilarityParam = ko.observable(600);
    self.rhymeWordFrequencyParam = ko.observable(100);
    self.syllableCountParam = ko.observable(300);

    $('#similarity').rangeslider({
        polyfill:false, 
        onSlide: function(position, value) { self.lineSimilarityParam(value)},
    });
    $('#freq').rangeslider({
        polyfill:false, 
        fillClass: 'rangeslider__fill_2',
        onSlide: function(position, value) { self.rhymeWordFrequencyParam(value)},
    });
    $('#syllables').rangeslider({
        polyfill:false, 
        fillClass: 'rangeslider__fill_3',
        onSlide: function(position, value) { self.syllableCountParam(value)},
    });

    

    self.songName = ko.observable('[Song Name]');
    self.songArtist = ko.observable('[Song Artist]');

    self.songNameEditable = ko.observable(false);
    self.songArtistEditable = ko.observable(false);

    self.lines = ko.observableArray([
        new Lyric('', '', 'Write your lyrics here, yo!', []),
    ]);

    self.statsOriginalLines = ko.computed(function(){
        var count = 0;
        $.each(self.lines(), function(index, line){
            if(!line.isUnoriginal()) count++;
        })
        return count;
    });

    self.activeLine = ko.observable(0);

    self.newLine = function(index, data, event) {
        if (event.target.value.length > 0) {
            self.lines.splice(index+1, 0, new Lyric('','',''));
            self.changeActiveLine(index+1, data, event);
        }
    };

    self.changeActiveLine = function(index, data, event) {
        $('.animated').removeClass('animated fadeInDown fadeInUp');
        self.activeLine(index);
    };

    self.generateLine = function(index, data, event) {
        $('#loading').fadeIn();
        var url = '/generateLines/'+escape(self.lines()[index].line())
            +'/'+escape(self.lineSimilarityParam())
            +'/'+escape(self.rhymeWordFrequencyParam())
            +'/'+escape(self.syllableCountParam());
        $.get(url, function(result) {
            console.log(result);
            if (result.length > 0) {
                lyric = result.shift();
                if (self.lines()[index].line().length == 0) {
                    self.lines.splice(index, 1, new Lyric(lyric.artist, lyric.song, lyric.line, result));
                } else {
                    self.lines.splice(index+1, 0, new Lyric(lyric.artist, lyric.song, lyric.line, result));
                    self.changeActiveLine(index+1, data, event);
                }
            }
            $('#loading').fadeOut();
        });
        
    };

    self.deleteLine = function(index, data, event) {
        if (self.lines().length == 1) return;
        self.lines.splice(index, 1);
        if (self.activeLine() >= self.lines().length) {
            self.changeActiveLine(self.lines().length - 1);
        }
    };
};

ko.bindingHandlers.attrIf = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var h = ko.utils.unwrapObservable(valueAccessor());
        var show = ko.utils.unwrapObservable(h._if);
        if (show) {
            ko.bindingHandlers.attr.update(element, valueAccessor, allBindingsAccessor);
        } else {
            for (var k in h) {
                if (h.hasOwnProperty(k) && k.indexOf("_") !== 0) {
                    $(element).removeAttr(k);
                }
            }
        }
    }
};

ko.applyBindings(new AppViewModel());