var octocats_feed_data = {
    q: 'http://feeds.feedburner.com/Octocats?format=xml'
    , num: -1
    , output: 'json'
    , v: '1.0'
};

$.ajax({
    url:'http://ajax.googleapis.com/ajax/services/feed/load'
    , type : "GET"
    , dataType : "jsonp"
    , data: octocats_feed_data
    , success: function (json) {
        var feed = json.responseData.feed;
        if(!feed) throw new Error('No feed!');
        var entries = feed.entries;
        if(!entries) throw new Error('No entries!');

        window.octocats = entries.map(function(entry) {
            var parts = entry.content.split('<img src="');
            var urlOfImg = parts[1].split('">')[0];

            return urlOfImg;
        });

    }
});

