const Controller = require('@baseController');
const SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
   
    clientId: '3cb4cfc950424f95b185b2df8ad66303',
    clientSecret: 'cbf7e70e5c4340ac8fca836f8f5e628a',
    redirectUri: 'http://127.0.0.1:8081/callback'
  });

class DashboardController extends Controller {
    constructor(opts) {
        super(opts);
        this.service = opts.dashboardService;
        this.title = 'Dashboard';
        this.view = '../dashboard';
        this.url = '/system/home';
        this.module = 'home';
    }
  
    async index(req, res) {
        try { 

            // res.redirect(spotifyApi.createAuthorizeURL([
            //     "ugc-image-upload",
            //     "user-read-recently-played",
            //     "user-read-playback-state",
            //     "user-top-read",
            //     "app-remote-control",
            //     "playlist-modify-public",
            //     "user-modify-playback-state",
            //     "playlist-modify-private",
            //     "user-follow-modify",
            //     "user-read-currently-playing",
            //     "user-follow-read",
            //     "user-library-modify",
            //     "user-read-playback-position",
            //     "playlist-read-private",
            //     "user-read-email",
            //     "user-read-private",
            //     "user-library-read",
            //     "playlist-read-collaborative",
            //     "streaming"

            // ]))
            // spotifyApi.setAccessToken('<your_access_token>');


            this.innerPage = this.view + '/index';
            const data = {};
            return res.render('layout/base-inner', this.viewData(data, this.module+'view'));
        } catch (error) {
            req.flash('error_msg', error.message);
            return res.redirect('/system/home');
        }
    }

    async spotifyCallback(req, res) {
        console.log(req.query);
        let code= req.query.code;
        console.log('code: ', code);
        let data = await spotifyApi.authorizationCodeGrant(code);
        console.log('data: ', data);
        spotifyApi.setAccessToken(data.body.access_token);

        spotifyApi.getCategories({
            limit : 5,
            offset: 0,
            country: 'SE',
            locale: 'sv_SE'
        })
        .then(function(data) {
          console.log(data.body.categories.items[2]);
        }, function(err) {
          console.log("Something went wrong!", err);
        });

        // res.send(JSON.stringify(req.query));
//  spotifyApi.setAccessToken('BQDjf1Xrp3aRysVKoX91dRTf8rVoxUeHHr0n7iDpGuQFNrF03SsXv5XZ2g1VQ6ATaDCl1kSXMbc7VB3unNEZcwXOu5XWer9bg7wwVjRfgrx0jaH2JrAI0aXbfO49GtEDdFwc9bzK2ztbJRpuFaMN54StRe_8as5F_A3UV9_k25xgZGKa9vJVbySrbZ44pmxAtPtlAic');
//  spotifyApi.getFeaturedPlaylists({ limit : 3, offset: 1, country: 'SE', locale: 'sv_SE', timestamp:'2014-10-23T09:00:00' })
//  .then(function(data) {
//    console.log(data.body);
//  }, function(err) {
//    console.log("Something went wrong!", err);
//  });
    }

   
    


}

module.exports = DashboardController;
