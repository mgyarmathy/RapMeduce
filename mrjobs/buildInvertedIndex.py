# MapReduce job to structure the songlyrics dataset into an inverted index for MongoDB

from mrjob.job import MRJob
import re
import simplejson as json
import math

class BuildInvertedIndex(MRJob):

    def mapper(self,key,line):
        tail_word, lyric = json.loads(line)['tail_word'], json.loads(line)
        
        yield tail_word, str(lyric)

    def reducer(self, tail_word, lyric):
        yield tail_word, '##'.join(lyric)

    def steps(self):
        return [self.mr(mapper = self.mapper, reducer = self.reducer)]
        
if __name__ == '__main__':
    BuildInvertedIndex.run()