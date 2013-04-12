(function() {
    "use strict";

    var Bananas = {
        pageTitle: '',
        $loadingIndicator: undefined,
        $title: undefined,
        $numberOfBananas: undefined,
        $timeSinceLastInput: undefined,
        $data: undefined,

        /**
         * Initializes banana info retrieval
         */
        init: function() {
            Bananas.pageTitle               = jQuery('title').text();
            Bananas.$numberOfBananas        = jQuery('#number-of-bananas');
            Bananas.$timeSinceLastInput     = jQuery('#time-since-last-input');
            Bananas.$data                   = jQuery('#data');
            Bananas.$loadingIndicator       = jQuery('<img src="img/loading.gif" alt="" class="loading" id="loading-indicator" />');
            
            jQuery('#content').append(Bananas.$loadingIndicator);

            // run every 60 seconds
            Bananas.makeTwitterRequest();
            setTimeout(Bananas.makeTwitterRequest, 60000); 
        },

        /**
         * Uses the Twitter API to get latest tweet about bananas 
         */
        makeTwitterRequest: function() {
            var apiUrl      = 'http://search.twitter.com/search.json?callback=?',
                query       = {q: "%23enirobananer", include_entities: "true", rpp: "2"},
                callback    = '';

            jQuery.getJSON(apiUrl, query, Bananas.handleBananaInfo);
        },

        /**
         * Retrieves number of bananas and time from Twitter data
         */
        handleBananaInfo: function(tweets) {
            var numberOfBananas     = 0,
                timeSinceLastInput  = 0,
                tweet               = tweets && tweets.results && tweets.results[0], 
                bananaStr, dateTweet, dateNow, dateDiff;

            if(tweet && tweet.text && tweet.created_at) {
                // find number
                bananaStr = tweet.text.match(/\d+/);
                numberOfBananas = bananaStr ? bananaStr[0] : 0; // bananaStr[0] || 0 ??
                    
                dateTweet  = new Date(tweet.created_at);
                dateNow    = new Date();
                dateDiff   = dateNow - dateTweet;
                timeSinceLastInput = Math.round(dateDiff/(1000*60));
            }
                            
            Bananas.displayBananaInfo({'numberOfBananas':numberOfBananas, 'timeSinceLastInput':timeSinceLastInput});
        },

        /**
         * Displays the retrieved data
         */
        displayBananaInfo: function(info) {
            Bananas.removeLoadingIndicator();

            Bananas.$numberOfBananas.html(info.numberOfBananas);
            Bananas.$timeSinceLastInput.html(info.timeSinceLastInput + ' min');

            jQuery('title').text('('+info.numberOfBananas+') '+Bananas.pageTitle);  
        },

        /**
         * Removes the loading indicator gif in case it is displayed
         */
        removeLoadingIndicator: function() {
            if(Bananas.$loadingIndicator.length) {
                Bananas.$loadingIndicator.remove();
                Bananas.$data.fadeIn();
            }   
        }
    };

    Bananas.init();

})(jQuery);