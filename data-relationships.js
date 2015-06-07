// function to compute similarity between nodes, independent of whether nodes are connected
// useful for computing edge weight if nodes are connected
// all individual scores are between 0 and 1
function nodeSimilarity(n1, n2) {
  // author similarity score - HIGH priority
  // more common authors and fewer authors are better
  var authors1 = n1.authors,
      authors2 = n2.authors,
      commonAuthors = _.intersection(authors1, authors2);
  var authorsScore = (commonAuthors.length * commonAuthors.length)/(authors1.length * authors2.length);

  // citation similarity score - MODERATE priority
  var citations1 = n1.citations,
      citations2 = n2.citations,
      commonCitations = _.intersection(citations1, citations2);
  var citationsScore = 0;
  if(citations1.length > 0 && citations2.length > 0) {
    citationsScore = (commonCitations.length * commonCitations.length)/(citations1.length * citations2.length);
  }

  // title similarity score - HIGH priority
  var titleScore = titleDistance(n1.title, n2.title);

  // venue similarity score - MODERATE/LOW priority
  var venueScore = 0;
  if(n1.venue == n2.venue) {
    venueScore = 0.1;
  }

  // temporal proximity score - MODERATE/LOW priority
  var year1 = n1.year;
  var year2 = n2.year;
  var yearDiff = Math.abs(year1-year2);
  var yearDiffScore = 0;
  if(yearDiff < 10) { // better to cite applications that are more recent
    yearDiffScore = (10 - yearDiff)/10;
  }

  // combine everything
  var authorsWeight = 1.0,
      citationsWeight = 1.0,
      titleWeight = 2.0,
      venueWeight = 0.5,
      yearDiffWeight = 0.5;
  return authorsWeight*authorsScore + citationsWeight*citationsScore + titleWeight*titleScore +
         venueWeight*venueScore + yearDiffWeight*yearDiffScore;
}

// function to compute 'difference' between two publication titles
function titleDistance(t1, t2) {
  var words1 = t1.toLowerCase().split(/[\s,.\-!?:\(\)\[\]]+/),
      words2 = t2.toLowerCase().split(/[\s,.\-!?:\(\)\[\]]+/);

  var keyWords1 = _.filter(words1, function(w) { return (CommonWords.indexOf(w) == -1); }),
      keyWords2 = _.filter(words2, function(w) { return (CommonWords.indexOf(w) == -1); });

  var commonSize = 0;
  for(var i=0; i<keyWords1.length; i++) {
    for(var j=0; j<keyWords2.length; j++) {
      if(sSimilarity(keyWords1[i], keyWords2[j]) > 0.66) {
        commonSize++;
      }
    }
  }
  return (commonSize)/Math.min(keyWords1.length, keyWords2.length)
}

var sSimilarity = function(sa1, sa2){
    // Source: https://gist.github.com/doorhammer/9957864
    // for my purposes, comparison should not check case or whitespace
    var s1 = sa1.replace(/\s/g, "").toLowerCase();
    var s2 = sa2.replace(/\s/g, "").toLowerCase();

    function intersect(arr1, arr2) {
        // I didn't write this.  I'd like to come back sometime
        // and write my own intersection algorithm.  This one seems
        // clean and fast, though.  Going to try to find out where
        // I got it for attribution.  Not sure right now.
        var r = [], o = {}, l = arr2.length, i, v;
        for (i = 0; i < l; i++) {
            o[arr2[i]] = true;
        }
        l = arr1.length;
        for (i = 0; i < l; i++) {
            v = arr1[i];
            if (v in o) {
                r.push(v);
            }
        }
        return r;
    }

    var pairs = function(s){
        // Get an array of all pairs of adjacent letters in a string
        var pairs = [];
        for(var i = 0; i < s.length - 1; i++){
            pairs[i] = s.slice(i, i+2);
        }
        return pairs;
    }

    var similarity_num = 2 * intersect(pairs(s1), pairs(s2)).length;
    var similarity_den = pairs(s1).length + pairs(s2).length;
    var similarity = similarity_num / similarity_den;
    return similarity;
};