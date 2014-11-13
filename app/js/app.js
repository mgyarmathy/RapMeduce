var Lyric = function(artist, song, line) {
    var self = this;
    self.artist = ko.observable(artist);
    self.song = ko.observable(song);
    self.line = ko.observable(line);

    self.isUnoriginal = ko.computed(function() {
        return self.artist().length > 0;
    });

    // have to use JSON objects here instead of Lyric() to prevent infinite loop
    self.alternateLines = ko.observableArray([
        {artist: 'Kanye West', song: 'Power', line: 'I\'m Livin in that 21st Century, doing something mean to it' },
        {artist: 'Kanye West', song: 'Power', line: 'Do it better than anybody you ever seen do it'},
        {artist: 'Kanye West', song: 'Power', line: 'Screams from the haters, got a nice ring to it'},
        {artist: 'Kanye West', song: 'Power', line: 'I guess every superhero need his theme music'},
    ]);

    self.alternateLineUp = function(data, event) {
        $(event.target).removeClass('animated fadeInUp fadeInDown');
        setTimeout(function() {
            self.alternateLines().push({artist: self.artist(), song: self.song(), line: self.line()})
            var lyric = self.alternateLines().shift();
            self.artist(lyric.artist);
            self.song(lyric.song);
            self.line(lyric.line);
            $(event.target).addClass('animated fadeInUp');
        },10);
    };

    self.alternateLineDown = function(data, event) {
        $(event.target).removeClass('animated fadeInUp fadeInDown');
        setTimeout(function() {
            self.alternateLines().unshift({artist: self.artist(), song: self.song(), line: self.line()});
            var lyric = self.alternateLines().pop();
            self.artist(lyric.artist);
            self.song(lyric.song);
            self.line(lyric.line);
            $(event.target).addClass('animated fadeInDown');
        },10);
    };
}

function AppViewModel() {
    var self = this;

    self.songName = ko.observable('[Song Name]');
    self.songArtist = ko.observable('[Song Artist]');

    self.songNameEditable = ko.observable(false);
    self.songArtistEditable = ko.observable(false);

    self.lines = ko.observableArray([
        new Lyric('', '', 'I\'m Livin in that 21st Century, doing something mean to it'),
        //new Lyric('Kanye West', 'Power', 'Do it better than anybody you ever seen do it'),
        //new Lyric('Kanye West', 'Power', 'Screams from the haters, got a nice ring to it'),
        //new Lyric('', '', 'I guess every superhero need his theme music')
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
        tail_word = self.lines()[index].line().match(/\w+/g).pop();
        $.get('/generateLines/'+tail_word, function(data) {
            console.log(data);
        });
        if (self.lines()[index].line().length == 0) {
            self.lines.splice(index, 1, new Lyric('Kanye West', 'Power', 'No one man should have all that power'));
        } else {
            self.lines.splice(index+1, 0, new Lyric('Kanye West', 'Power', 'No one man should have all that power'));
            self.changeActiveLine(index+1, data, event);
        }
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