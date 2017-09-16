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


app.controller("MainCtrl",function($scope,$http){

    
    $http.get('/api/login-user')
    .then(function(response) {
        $scope.login_user = response.data;
        console.log( $scope.login_user);
    });
    
    /*$http.get('/api/kpi/get_kpi_stats/' + id)
    .then(function(response) {
        //First function handles success
        $scope.best_val = response.data;
    }, function(response) {
        //Second function handles error
        console.log(response.statustext);
    });
    */

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
    
    bookingFactory.getData()
    .success(function(data){
       $scope.bookings=data;
   })
    .error(function(error){
        console.log(error);
    });
});