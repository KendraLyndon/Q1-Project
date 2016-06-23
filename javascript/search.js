var restaurants = [];
var info = $('#info');

function initMap() {
  window.setTimeout(function(){
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.4169, lng: -3.7035},
      scrollwheel: false,
      zoom: 12
    });
    //MAKE MARKERS OUTSIDE OF MAP INIT???
    //REFACTOR, MORE MODULAR
    //PLAY WITH INFOWINDOW
    // addMarkers(restaurants);
    for(var i=0; i<restaurants.length; i++){
      var marker = new google.maps.Marker({
        position: {
          lat: restaurants[i].location.coordinate.latitude,
          lng: restaurants[i].location.coordinate.longitude
        },
        map: map,
        title: restaurants[i].name,
        label: i.toString(),
      });
      function markListener(label){
        marker.addListener('click', function() {
          map.setZoom(13);
          map.setCenter(marker.getPosition());
          var test = document.createElement('div');
          $(test).addClass('test');
          $(test).attr('id',label);
          // console.log(test);
          updateRestaurantInfo(info, restaurants[label]);
          // $(test).text(restaurants[b].name+', '+restaurants[b].display_phone+', '+restaurants[b].location.address[0]);
          // $(info).append(test);
        });
      }
      markListener(marker.label);
    }
  },1500);
}


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

function addBusinesses(businesses){
  for(var i=0;i<businesses.length;i++)
  {
    if(businesses[i].rating > 4){
      restaurants.push(businesses[i]);
    }
  }
  console.log(restaurants);
}

function updateRestaurantInfo(element, data){
  element.empty();
  var name = document.createElement('p');
  $(name).text(data.name);
  var phone = document.createElement('p');
  $(phone).text(data.display_phone);
  var address = document.createElement('p');
  $(address).text(data.location.address[0]);
  // $(element).text(data[b].name+', '+data[b].display_phone+', '+data[b].location.address[0]);
  $(element).append(name,phone,address);
}


// console.log(businesses[0].location.coordinate.latitude+', '+businesses[0].location.coordinate.longitude);
// function addMarkers(data){
//   for(var i=0; i<data.length; i++){
//     var marker = new google.maps.Marker({
//       position: {
//         lat: data[i].location.coordinate.latitude,
//         lng: data[i].location.coordinate.longitude
//       },
//       map: map,
//       title: data[i].name,
//       label: i.toString(),
//     });
// }
