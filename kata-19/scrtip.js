var fs = require('fs');

var words = fs.readFileSync("wordlist.txt")
              .toString()
              .toLowerCase()
              .split("\n");

var countDifferences = function(word1, word2) {
    var count = 0;
    for (var i = 0; i < word1.length; i++) {
        if (word1[i] !== word2[i]) count++;
    }
    return count;
}

var memo = []

var search = function(start, end, predecessors, frontier) {
    for (var i = 0; i < frontier.length; i++) {
        if (frontier[i].word === start) {
            frontier.splice(i, 1);
            break;
        }
    }
    
    memo = memo.concat(start);
    
    if (start === end){
       return predecessors.concat(start);
    }

    var wordlist = frontier.concat(words.filter(function(word) {
        
        return word.length === end.length
               && countDifferences(start, word) === 1
               && predecessors.indexOf(word) === -1
               && memo.indexOf(word) === -1;
    }).filter(function(word, idx, list) {
        
        return list.indexOf(word) === idx;
    }).map(function(element) {
        return {
                   "word": element,
                   "cost": predecessors.length,
                   "predecessors": predecessors.concat(start)
               };
    }).filter(function(node) {
        for (var i = 0; i < frontier.length; i++) {
            if (frontier[i].word === node.word && frontier[i].cost < node.cost){ 
                return false;
            }
        }
        return true;
    })).sort(function(node1, node2) {
        return (countDifferences(node1.word, end) + node1.cost) - (countDifferences(node2.word, end) + node2.cost);
    });
    return search(wordlist[0].word, end, wordlist[0].predecessors, wordlist);
}

console.time("Time");
console.log(search("lead", "gold", [], []));
console.timeEnd("Time");