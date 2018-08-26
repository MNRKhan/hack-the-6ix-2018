$(document).ready(function() {
	// Tracking user with enter key.
	$("#userName").keypress(function(event){
		if(event.which == 13) {
			getUser();
		}
	});

	// Sending a request to grant tracking
	$("#track-submit").on("click", () => submitTrackReq());
});

function refreshMap(url) {
	$.getJSON(url)
	.then(userMap);
}

function getUser() {
	var usrInput = $("#userName").val(),
		careUser = $("#careUser").val(),
        getURL   = "https://elderly-monitoring-project-webapp.lib.id/Elderly-App@dev/get-past-locations?seniorUsername=" + usrInput + "&caretakerUsername=" + careUser,
		refresh;

	refreshMap(getURL);

	refresh = setInterval(() => {
		refreshMap(getURL);
		}, 10000);

	$("#userName").keypress(function(event){
		if(event.which == 13) { 
			clearInterval(refresh);
		}
	});
};

var map;

// var marker;
function userMap(user) {
	if(!Array.isArray(user)) alert("Either the user does not exist or you don't have permission!");
	else {
		const {latitude, longitude} = user[user.length - 1];
		const userPos = {lat: latitude, lng: longitude}
		map.setCenter(new google.maps.LatLng(latitude, longitude));
		// marker.setMap(map);
		var marker = new google.maps.Marker({position: userPos, map: map});
	}
}

// submit request to track user
function submitTrackReq() {
	const user 	= $("#seniorTrack").val(),
		caretaker = $("#careTrack").val(),
		apiURL = "https://elderly-monitoring-project-webapp.lib.id/Elderly-App@dev/request-subscription-to-senior?seniorUsername=" + user + "&caretakerUsername=" + caretaker;
	$.get(apiURL)
	.then((obj) => { 
		$(".return").text("Request Submitted!");
		$("#seniorTrack").val("");
	});
}

// default map initiliaze.
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  center: {lat: 43.668580, lng: -79.393234},
	  zoom: 12
	});
  }