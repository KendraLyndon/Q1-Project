var info = $('#info');
var spain;
var currCenter;
var marker;
var restaurants = [];
var markers = [];
var googleKey = 'AIzaSyCuNZFnztsemUai7NSIdKMb1igGVPQCJ48';

function initMap() {
  addMap();
  var geocoder = new google.maps.Geocoder;
  spain.addListener('zoom_changed',function(){
    currCenter = JSON.parse(JSON.stringify(spain.getCenter()));
    geocodeLatLng(geocoder,spain,currCenter);
  });
  spain.addListener('dragend',function(){
    currCenter = JSON.parse(JSON.stringify(spain.getCenter()));
    geocodeLatLng(geocoder,spain,currCenter);
  });
}

function addMap(){
  spain = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.4169, lng: -3.7035},
    scrollwheel: true,
    zoom: 7
  });
}

function geocodeLatLng(geocoder,spain,currCenter) {
  geocoder.geocode({'location': currCenter}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results) {
        if(spain.getZoom()<9){
          clearMarkers();
        }
        if (spain.getZoom()>8 && spain.getZoom()<12){
          searchCityZoom9(results);
        }
        else if(spain.getZoom()>11){
          searchCityZoomIn(results);
        }
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function searchCityZoom9(results){
  clearMarkers();
  var currentCity;
  results.forEach(function(result){
    if (result.types[0]==="administrative_area_level_2"){
      currentCity = result.address_components[0].long_name;
    }
  })
  findTapas(currentCity);
}

function searchCityZoomIn(results){
  var currentNeighborhood;
  clearMarkers();
  results.forEach(function(result){
    if (result.types[0]==="neighborhood"){
      currentNeighborhood = result.address_components[0].long_name;
      currentNeighborhood+=', '+result.address_components[1].long_name;
    }
  });
  if(!currentNeighborhood){
    results.forEach(function(result){
      if (result.types[0]==="administrative_level_3"){
        currentNeighborhood = result.address_components[0].long_name;
        currentNeighborhood+= ', '+result.address_components[1].long_name;
      }
    })
  };
  if(!currentNeighborhood){
    results.forEach(function(result){
      if (result.types[0]==="administrative_area_level_2"){
        currentNeighborhood = result.address_components[0].long_name;
      }
    })
  };
  findTapas(currentNeighborhood);
}

function findTapas(currentPlace){
  $.when(
    $.ajax({
      url: 'https://galvanize-yelp-api.herokuapp.com/search',
      data: {
        category_filter: 'tapas',
        location: currentPlace,
        cc: 'ES'
      },
      method: 'POST'
    }).done(function(results){
      var businesses = results.businesses;
      editBusinesses(businesses);
    })).then(function(){
    addMarkers(spain,restaurants)
  })
}


function editBusinesses(businesses){
  restaurants = [];
  for(var i=0;i<businesses.length;i++)
  {
    if(businesses[i].rating > 4){
      restaurants.push(businesses[i]);
    }
  }
}

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
        // getPlaceId(restaurants[Number(label)]);
        
        // console.log(restaurants[Number(label)]);
        // updateRestaurant(info, restaurants[Number(label)]);
      });
    }
    markListener(marker.label);
  }
}

function getPlaceId(data){
  console.log(data.name);
  console.log(typeof(data.name));
  currCenter = JSON.parse(JSON.stringify(spain.getCenter()));
  var request = {
    location: currCenter,
    radius: '100',
    name: 'El Mini',
    // keyword: data.name,
    //the name parameter is too specific. if the name in googlemaps
    //doesn't exactly match the yelp name, search will not yield results.
    //Need to refactor for more general search?
    // type: 'restaurant'
  };
  var service = new google.maps.places.PlacesService(spain);
  service.nearbySearch(request, function(results, status) {
    console.log('*****NEARBYSEARCH RUNNING******');
    console.log(status);
    console.log(request.location);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log('results!!!!');
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        var id = place.place_id;
        // placeDetailsByPlaceId(info, spain, id, data);
        console.log('******'+id+'*********');
      }
    }
  });
}

function placeDetailsByPlaceId(element, spain, id, data) {
  var request = {placeId: id};
  var service = new google.maps.places.PlacesService(spain);
  service.getDetails(request, function (place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(place);
      element.empty();
      var name = document.createElement('p');
      $(name).text(place.name);
      var phone = document.createElement('p');
      $(phone).text('phone: '+place.formatted_phone_number);
      var address = document.createElement('p');
      $(address).text('address: '+place.formatted_address);
      var rating = document.createElement('p');
      $(rating).text('rating: '+place.rating);
      $(element).append(name,phone,address,rating);
    }
  });
}

function addPlaceDetails(){
  console.log('this doesnt work yet!');
}
// function addInfoWindow(marker){
//   var infowindow = new google.maps.InfoWindow({
//     content: 'restaurant'
//   });
//   infowindow.open(spain,marker);
// }

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
  markers = [];
}
