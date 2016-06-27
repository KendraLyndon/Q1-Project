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
<<<<<<< HEAD

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
=======
  spain.addListener('zoom_changed',function(){
    currCenter = JSON.parse(JSON.stringify(spain.getCenter()));
    geocodeLatLng(geocoder,spain,currCenter);
  });
  spain.addListener('dragend',function(){
    currCenter = JSON.parse(JSON.stringify(spain.getCenter()));
    geocodeLatLng(geocoder,spain,currCenter);
  });
>>>>>>> googlePlaces
}

function addMap(){
  spain = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.4169, lng: -3.7035},
    scrollwheel: true,
    zoom: 7
  });
}

<<<<<<< HEAD
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
=======
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
>>>>>>> googlePlaces

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
        updateRestaurant(info, restaurants[Number(label)]);
      });
    }
    markListener(marker.label);
  }
}

function updateRestaurant(element,data){
  element.empty();
  var name = document.createElement('p');
  $(name).attr('id','name')
  $(name).text(data.name);
  var phone = document.createElement('p');
  $(phone).text('phone: '+data.display_phone);
  var address = document.createElement('p');
  $(address).text('address: '+data.location.address[0]+', '+data.location.city);
  var rating = document.createElement('p');
  $(rating).text('rating: '+data.rating);
  var link = document.createElement('a');
  $(link).attr('href',data.url);
  $(link).text('visit yelp page');
  $(element).append(name,phone,address,rating,link);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function clearMarkers() {
  setMapOnAll(null);
  markers = [];
}
