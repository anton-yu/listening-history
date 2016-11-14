(function(exports) {
	// spotify 
	var client_id = ''; // Your client id
	var client_secret = ''; // Your secret
	var redirect_uri = ''; // Your redirect uri

	// last.fm
	var API_KEY = '';
	var root = 'http://ws.audioscrobbler.com/2.0/';
	var g_tracks = [];

	var findTracks = function(history) {
		history.recenttracks.track.forEach(function(track) {
			var url = 'https://api.spotify.com/v1/search?type=track&limit=50&q=' + encodeURIComponent('track:"'+track.name+'"');
			$.ajax(url, {
				dataType: 'json',
				success: function(r) {
					if (r.tracks.items[0]) {
						console.log('got track', r.tracks.items[0]);
						g_tracks.push(r.tracks.items[0].uri);
					}
					else 
						console.log('could not find', track);
				},
				error: function() {
					console.log('failed to retrieve track', track.name);
				},
				complete: function() {
					localStorage.setItem('createplaylist-tracks', JSON.stringify(g_tracks)); 
				}
			});
		});
	}

	var retrieveHistory = function() {
		var user = $('#alltext').val().trim();
		var url = root + '/?method=user.getrecenttracks&user=' + user + '&api_key=' + API_KEY + '&format=json';
		$.ajax(url, { 
			dataType: 'json',
			success: function(r) {
				console.log('got last.fm recent tracks for user', user);
				findTracks(r);
				},
			error: function() {
				console.log('failed to retrieve last.fm user', user); 
			}
		});
	}

	var g_access_token = '';
	var g_username = '';

	var doLogin = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		window.location.replace(url);
	}

	exports.startApp = function() {
		console.log('start app.');
		$('#start').click(function() {
			retrieveHistory();
			doLogin(function() {});
		})
}

})(window);
