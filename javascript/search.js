var info = $('#info');
var spain;
var currCenter;
var currentCity;
var marker;
var restaurants = [];
var markers = [];

function initMap() {
  addMap();
  var geocoder = new google.maps.Geocoder;

  // $.when(findTapas()).then(function(data) {
    spain.addListener('zoom_changed',function(){
      if(spain.getZoom()===9){
        currCenter = JSON.parse(JSON.stringify(spain.getCenter()));
        console.log(currCenter);
        $.when(findTapas()).then(function(data){
          console.log(('HELLO!!!!!!'));
          // geocodeLatLng(geocoder,spain,currCenter);
          addMarkers(spain,restaurants);
        })
      };
      if(spain.getZoom()<9){
        clearMarkers()
      };
    });
  // });
}

function addMap(){
  spain = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.4169, lng: -3.7035},
    scrollwheel: true,
    zoom: 7
  });
}

// function geocodeLatLng(geocoder, spain,currCenter) {
//   var latlng = {lat: currCenter.lat, lng: currCenter.lng};
//   geocoder.geocode({'location': latlng}, function(results, status) {
//     if (status === google.maps.GeocoderStatus.OK) {
//       if (results[1]) {
//         console.log(results);
//         currentCity = results[8].formatted_address;
//         console.log('HIII!!!!!'+currentCity);
//       } else {
//         window.alert('No results found');
//       }
//     } else {
//       window.alert('Geocoder failed due to: ' + status);
//     }
//   });
// }

function addMarkers(spain,data){
  for(var i=0; i<data.length;i++){
    marker = new google.maps.Marker({
      position: {
        lat: data[i].location.coordinate.latitude,
        lng: data[i].location.coordinate.longitude
      },
      map: spain,
      label: i.toString()
    });
    markers.push(marker);
    function markListener(label){
      marker.addListener('click', function() {
        // addInfoWindow(marker);
        updateRestaurant(info, restaurants[Number(label)]);
      });
    }
    markListener(marker.label);
  }
}

function addInfoWindow(marker){
  var infowindow = new google.maps.InfoWindow({
    content: 'restaurant'
  });
  infowindow.open(spain,marker);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
}

function findTapas(){
  $.ajax({
    url: 'https://galvanize-yelp-api.herokuapp.com/search',
    data: {
      category_filter: 'tapas',
      location: 'Madrid',
      cc: 'ES'
    },
    method: 'POST'
  }).done(function(results){
    var businesses = results.businesses;
    addBusinesses(businesses);
  });
}

function addBusinesses(businesses){
  for(var i=0;i<businesses.length;i++)
  {
    if(businesses[i].rating > 4){
      restaurants.push(businesses[i]);
    }
  }
}

function updateRestaurant(element, data){
  element.empty();
  var name = document.createElement('p');
  $(name).text(data.name);
  var phone = document.createElement('p');
  $(phone).text(data.display_phone);
  var address = document.createElement('p');
  $(address).text(data.location.address[0]);
  $(element).append(name,phone,address);
}
