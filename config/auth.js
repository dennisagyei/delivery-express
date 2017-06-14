// <!-- will hold all our client secret keys (facebook, twitter, google) -->

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '179862729206704', // your App ID
        'clientSecret'  : 'b833acb6bc36993d0dc81c9bcee8d6d3', // your App Secret
        'callbackURL'   : 'http://104.237.157.91/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '404415622866-ele9j8l5a84kfbntuc04eroe33t6empa.apps.googleusercontent.com',
        'clientSecret'  : 'kgKJFt16Pf7ZjwPW8ga0-fFw',
        'callbackURL'   : 'http://104.237.157.91/auth/google/callback'
    }

};