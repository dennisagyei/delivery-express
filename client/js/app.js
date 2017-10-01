//console.clear();

var app = angular.module('app', ['ngResource']);


app.filter('custNumFormat',function (){
    
    return function(input, symbol) {
        
        var resp = '';
        
        if (symbol=='%')
        {
            resp=input+'%';
        }else
        {
            resp='Ghs'+input;
        }
        
        return resp;
        
    }
});

//creating service that is accessible accross controllers
app.value('ApiKey','AIzaSyC9H_SZmYKPM0TXnnnHxcRPMJyYjf00rvs');


app.factory('userFactory',function($resource){
    
    return $resource('/api/user/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.factory('bookingFactory',function($resource){
    
    return $resource('/api/booking/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.factory('agentFactory',function($resource){
    
    return $resource('/api/agent/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.controller("MainCtrl",function($scope,$http,agentFactory){

    //get login user details
    $http.get('/api/login-user')
    .then(function(response) {
        $scope.login_user = response.data;
        //console.log( $scope.login_user);
    });
    
    $scope.couriers=agentFactory.query();
    
    $scope.getCourierByID=function(varID){
        
        var response=agentFactory.get({id: varID });
            response.$promise.then(function(data) {
                $scope.selectedCourier=data.toJSON();
                console.log($scope.selectedCourier);
            });
    }
    
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    $scope.confirmItem = function(Item){
     
        $scope.invoice_no=getRandomInt(199999,3999999);   
        
        $scope.courier=$("#selectcourier option:selected" ).text();
        
        if (Item)
        {
            if (!Item.picking_up)
            {
                $('#picking_up').popover('show');
                return;
            }else if (!Item.dropping_off)
            {
                $('#dropping_off').popover('show');
                return;
            } else {
                
                $scope.getCourierByID(Item.courier);
                console.log($scope.selectedCourier);
                $('#confirmModal').modal();
            }
        }
        else
        {
            $('#picking_up').popover('show');
            $('#dropping_off').popover('show');
            return ;
            
        }
    }; 
    
    
    ////////////////////////MAP CODE//////////////////////////////////////////////////////
    
    infoWindow = new google.maps.InfoWindow;
        
              
    function GetIpPosition()
    {
        $http.get("https://ipinfo.io")
            .then(function(response) {

            var loc = response.data.loc.split(',');
            	var	pos = {
            			lat: parseFloat(loc[0]),
            			lng: parseFloat(loc[1])
            		};
        });
    }
    
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                                      'Error: The Geolocation service failed.' :
                                      'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open($scope.map);
    }
    
    function displayRoute(origin_add,destination_add)
    {
                  // Set destination, origin and travel mode.
                    var request = {
                      destination: destination_add,
                      origin: origin_add,
                      optimizeWaypoints: true,
                      travelMode: 'DRIVING'
                    };
            
                    // Pass the directions request to the directions service.
                    directionsService.route(request, function(response, status) {
                      if (status == 'OK') {
                        // Display the route on the map.
                        //directionsDisplay.setDirections(response);
                        directionsDisplay.setMap($scope.map);
                        directionsDisplay.setDirections(response);
                        
                        deleteMarkers();
                      }else {
                        console.log('Directions request failed due to ' + status);
                      } 
                    });
    }
    
    function geocodePosition(inputlatlng) //convert LatLng to Address
    { 
              var geocoder = new google.maps.Geocoder();
              
              var latlngStr = inputlatlng.split(',', 2);
              
             
              var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
              
               //console.log(latlng);
              
              geocoder.geocode({'location': latlng}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                  if (results[1]) {
                    return results[1].formatted_address;
                  } else {
                    console.log('GeocodePosition No results found');
                  }
                } else {
                  console.log('geocodePosition failed due to: ' + status);
                }
              });
              
    }
    
    function computeTotalDistance(result) {
                //console.log(result);
                $scope.totalDistance = 0;
                $scope.totalDuration = 0;
                var myroute = result.routes[0];
                
                for (var i = 0; i < myroute.legs.length; i++) {
                    $scope.totalDistance += myroute.legs[i].distance.value;
                    $scope.totalDuration += myroute.legs[i].duration.value;
                    
                    
                    //var strA= geocodePosition(myroute.legs[i].start_location.lat()+ ',' + myroute.legs[i].start_location.lng());
                    //geocodePosition('5.603042299999999,-0.17568630000005214');
                    $scope.start_pos= myroute.legs[i].start_location.lat()+ ',' + myroute.legs[i].start_location.lng();
                    $scope.end_pos= myroute.legs[i].end_location.lat()+ ',' + myroute.legs[i].end_location.lng();
                    
                    $scope.start_address=myroute.legs[i].start_address;
                    $scope.end_address=myroute.legs[i].end_address;
                    
                    //document.getElementById('picking_up').value=$scope.start_address;
                    //document.getElementById('dropping_off').value=$scope.end_address;
                }
                
                
                //console.log('computeTotalDistance:'+ totalDistance);
                //console.log('computeTotalDuration:'+ totalDuration);
                //console.log('pick-up loc:'+ result.request.origin.query);
                //console.log('pick-up point:'+ start_pos);
                //console.log('Drop-off Loc:'+ result.request.destination.query );
                //console.log('drop-off point:'+ end_pos);
    }
              
    function deleteMarkers() {
                markerA.setMap(null);
                markerB.setMap(null);
                //markers = [];
    }
    
    var mapOptions = {
                    //center: {lat: 5.5885497, lng: -0.185424},
                    zoom: 6,
                    zoomControl: true,
                    mapTypeControl: false,
                    styles: styles['silverr'] //or 'night'
                };
                
    $scope.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    
    // auto set location geolocation.
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            
            var pos = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude
                    };
            //console.log(pos);
                $scope.map.setCenter(pos);
                  }, function() {
                    handleLocationError(true, infoWindow, $scope.map.getCenter());
                  });
                } else {
                  // Browser doesn't support Geolocation
                  handleLocationError(false, infoWindow, $scope.map.getCenter());
                }                

                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer({
                  draggable: true,
                  map: $scope.map
                });
        
                directionsDisplay.addListener('directions_changed', function() {
                
                $scope.computeDistance = computeTotalDistance(directionsDisplay.getDirections());
                //console.log(directionsDisplay.getDirections());  
                });
                //Define Markers
                markerA = new google.maps.Marker({
                    map: $scope.map,
                    label : 'A',
                    draggable: true,
                    title: 'Drag to set Pickup Location'
                  });
                
                markerB = new google.maps.Marker({
                    map: $scope.map,
                    label : 'B',
                    draggable: true,
                    title: 'Drag to set drop-off Location'
                  });
                
                inputA= document.getElementById('picking_up');
                inputB= document.getElementById('dropping_off');
                
                var AutocompleteOptions = {
                  componentRestrictions: {country: 'gh'}
                 };

                var autocompleteA = new google.maps.places.Autocomplete(inputA,AutocompleteOptions);
                    autocompleteA.bindTo('bounds', $scope.map);

                var autocompleteB = new google.maps.places.Autocomplete(inputB,AutocompleteOptions);
                    autocompleteB.bindTo('bounds', $scope.map);
                
                google.maps.event.addListener(autocompleteA, 'place_changed', function() {
                    
                    var place = autocompleteA.getPlace();
                    if (!place.geometry) {
                      return;
                    }
                
                    // Set the position of the marker using the place ID and location.
                    markerA.setPlace(/** @type {!google.maps.Place} */ ({
                      placeId: place.place_id,
                      location: place.geometry.location
                    }));
                    markerA.setVisible(true);
                
                });
                
                google.maps.event.addListener(autocompleteB, 'place_changed', function() {
                    
                    var place = autocompleteB.getPlace();
                    if (!place.geometry) {
                      return;
                    }
                
                    // Set the position of the marker using the place ID and location.
                    markerB.setPlace(/** @type {!google.maps.Place} */ ({
                      placeId: place.place_id,
                      location: place.geometry.location
                    }));
                    markerB.setVisible(true);
                    
                    $scope.map.setZoom(11);
                    
                    displayRoute(inputA.value,inputB.value);
                });
                
});

app.controller("ProfileCtrl",function($scope,$http,userFactory){
    
     
    $http.get('/api/login-user')
    .then(function(response) {
      
        $scope.login_user = response.data;
        
        $scope.edit_user={};
        $scope.edit_user.id=response.data._id;
        $scope.edit_user.phone=response.data.phone;
        if (response.data.local)
        {
        $scope.edit_user.name=response.data.local.name;
        $scope.edit_user.email=response.data.local.email;
        }
        
    }, function(response) {
        //Second function handles error
        console.log(response.statustext);
    });
    
   $scope.UpdateItem = function (Item) {
        userFactory.update({id: $scope.edit_user.id }, Item);
    
    };
     
});

app.controller("BookingCtrl",function($scope,$http,bookingFactory){
    
    $scope.bookings=bookingFactory.query();
    
    
});

app.controller("AgentCtrl",function($scope,$http,agentFactory){
    
    $scope.agents=agentFactory.query();
    
    $scope.messages = ''; 
    
    $scope.Refresh = function () {
    	$scope.new_agent.name= '';
    	$scope.new_agent.website= '';
    };

    $scope.AddItem = function(){
        $('#addModal').modal();
    }; 
    
    $scope.EditItem = function(Item){
        
        $scope.edit_agent = Item;
        $('#editModal').modal();
    }; 
   
    $scope.SaveItem = function (Item) {
        
        agentFactory.create(Item,function(){
            $scope.Refresh();
        });
        $scope.messages = 'New Courier has been created!'; 
        $scope.agents=agentFactory.query();
        
        $('#addModal').modal('hide')
        

    };
    
    $scope.UpdateItem = function (Item) {
        agentFactory.update({id: Item._id }, Item);
    	$scope.agents=agentFactory.query();
    	$('#editModal').modal('hide')
    };
    
    $scope.DeleteItem = function (Item) {
        agentFactory.destroy({id: Item });
        $scope.agents=agentFactory.query();
    };
    
    $scope.FindItem = function (Item) {
        agentFactory.find({id: Item });
    };
    
});