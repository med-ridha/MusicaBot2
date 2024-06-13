import fetch from 'node-fetch';
const clientID = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_SECRET;

export async function getAccessToken(): Promise<string> {
    const url = 'https://accounts.spotify.com/api/token';
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    const body = new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': clientID!,
        'client_secret': clientSecret!
    });
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
    });

    if (!response.ok) {
        console.log(response);
        return 'Failed to get access token'
    }

    const data: any = await response.json();
    return data.access_token;
}

export async function getTrackInfo(trackID: string, accessToken: string): Promise<string> {
    const url = `https://api.spotify.com/v1/tracks/${trackID}`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers

    });

    if (!response.ok) {
        console.log(response);
        return 'Failed to get track info'
    }

    const data: any = await response.json();
    return data.name + ' by ' + data.artists[0].name;
}

export async function getPlaylistInfo(playlistID: string, accessToken: string): Promise<string[]> {
    const url = `https://api.spotify.com/v1/playlists/${playlistID}`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    const response = await fetch(url, {
        method: 'GET',
        headers: headers

    });

    if (!response.ok) {
        console.log(response);
        return ['Failed to get playlist info']
    }

    const data: any = await response.json();
    let songs: string[] = [];
    data.tracks.items.forEach((item: any) => {
        songs.push(item.track.name + ' by ' + item.track.artists[0].name);
    });
    return songs;
}
