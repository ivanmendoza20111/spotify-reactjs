import axios from 'axios';
import { TrackHandler, Client } from 'spotify-sdk';

let client = Client.instance;
client.settings = {
    clientId: '4d310e62cced46c790ca6adbada91cb5',
    secretId: 'c940ecd7f6944d95b01397b18927919e',
    scopes: ['user-follow-modify user-follow-read user-library-read user-top-read'],
    redirect_uri: 'http://localhost:3002/'
}

export const checkSignIn = () => {
    return( dispatchEvent, getState ) => {
        if(sessionStorage.token){
            client.token = sessionStorage.token;
        }else if(window.location.hash.split('&')[0].split('=')[1]){
            client.token = sessionStorage.token = window.location.hash.split('&')[0].split('=')[1];
        }else{
            client.login()
             .then( url => {
                 window.location.href= url;
             })
        }
    }
}

const startFetch = () => { return { type: "IS_FETCHING", isFetching: true } };
const errorFetch = (err) => { return { type: 'ERROR_FETCH',isFetching: false, err } };
const completeFetch = (data) => { return { type:'COMPLETE_FETCH', isFetching: false, payload: data } };
export const search = (trackName) => {
    return ( dispatch, getState ) => {
        dispatch(startFetch());
        let track = new TrackHandler();

        track.search(trackName, { limit: 5 } )
         .then( trackCollection => {
            dispatch(completeFetch(trackCollection));
         })
         .catch( err => {
             dispatch(errorFetch(err));
             console.log(err);
         });
    }
}

const completeSong = (data) => { return { type:'COMPLETE_FETCH_SONG', isFetching: false, payload: data } };
export const playTrack = (songId) => {
    return ( dispatch,getState ) => {
        dispatch(startFetch());
        axios.get('https://api.spotify.com/v1/tracks/'.concat( songId ), { headers: { "Authorization" : "Bearer " + client.token } })
         .then( reponse => {
            dispatch(completeSong(reponse.data));
         })
         .catch( err => {
            dispatch(errorFetch(err));
            console.log(err);
         });
    };
}