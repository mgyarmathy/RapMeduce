var Lyric = function(artist, song, line) {
    var self = this;
    self.artist = ko.observable(artist);
    self.song = ko.observable(song);
    self.line = ko.observable(line);
}

function AppViewModel() {
    var self = this;

    self.lines = ko.observableArray([
        new Lyric('Kanye West', 'Power', 'I\'m Livin in that 21st Century, doing something mean to it'),
        new Lyric('Kanye West', 'Power', 'Do it better than anybody you ever seen do it'),
        new Lyric('Kanye West', 'Power', 'Screams from the haters, got a nice ring to it'),
        new Lyric('Kanye West', 'Power', 'I guess every superhero need his theme music')
    ]);

    self.activeLine = ko.observable(0);

    self.newLine = function(index, data, event) {
        self.lines.splice(index+1, 0, new Lyric('','',''));
        self.changeActiveLine(index+1, data, event);
    };

    self.changeActiveLine = function(index, data, event) {
        self.activeLine(index);
    }

    self.generateLine = function(index, data, event) {
        self.lines.splice(index+1, 0, new Lyric('Kanye West', 'Power', 'No one man should have all that power'));
        self.changeActiveLine(index+1, data, event);
    }

    self.deleteLine = function(index, data, event) {
        self.lines.splice(index, 1);
        if (self.activeLine() >= self.lines().length) {
            self.changeActiveLine(self.lines().length - 1);
        }
    }
};

ko.applyBindings(new AppViewModel());