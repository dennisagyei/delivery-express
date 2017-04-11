//console.clear();

var app = angular.module('app', ['ngRoute','ngCookies','ngResource','angular-flexslider','angularFileUpload']);

app.config(function($routeProvider,$locationProvider){

    $routeProvider.when('/',{ templateUrl : "home2.html" , controller : 'HomeCtrl'});
    $routeProvider.when('/subscribe',{ templateUrl : "subscribe.html"});
    $routeProvider.when('/faq',{ templateUrl : "faq.html"});
    $routeProvider.when('/contact',{ templateUrl : "contact.html"});
    $routeProvider.when('/compare/:id',{ templateUrl : "compare.html" , controller : 'MainCtrl'});
    $routeProvider.when('/category/:id',{ templateUrl : "category.html" , controller: "CatgCtrl"});
    $routeProvider.when('/register',{ templateUrl : "registration.html" , controller: 'RegisterCtrl'});
    $routeProvider.when('/admin',{ templateUrl : "login.html" , controller: 'LoginCtrl'});
    $routeProvider.when('/admin/signup',{ templateUrl : "signup.html" , controller: 'SignupCtrl'});
    $routeProvider.when('/admin/company',{ templateUrl : "company.html" , controller: 'CompanyCtrl'});
    $routeProvider.when('/admin/kpi',{ templateUrl : "kpi.html" , controller: 'KpiCtrl'});
    $routeProvider.when('/admin/rates',{ templateUrl : "rates.html" , controller: 'RatesCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);

});

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


app.factory("HomekpiFactory",function($http){
  
  return {
            getData : function(){
               return $http.get("/api/kpi/get_kpi_stats")
            }
        }
});

app.factory("RateskpiFactory",function($resource){
  
        return $resource('/api/metric/join_kpi', {}, {
        'query' : { method: 'GET', isArray: true }
        });
});


//factory with ngResource
app.factory('companyFactory',function($resource){
    
    return $resource('/api/company/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.factory('kpiFactory',function($resource){
    
    return $resource('/api/kpi/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.factory('metricFactory',function($resource){
    
    return $resource('/api/metric/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.controller('HomeCtrl', function($scope,$http,$timeout,HomekpiFactory) {
    
    $scope.success_msg='';
    $scope.error_msg='';
    
    HomekpiFactory.getData()
    .success(function(data){
       $scope.kpi_stats=data;
   })
    .error(function(error){
        console.log(error);
    });
    
    
    $http.get("/api/kpi/get_featured_kpi")
    .then(function(response) {
        $scope.kpi_featured = response.data;
    });
    
    $http.get("/api/metric/join_kpi")
    .then(function(response) {
        $scope.kpi_metrics = response.data;
    });
    
    $scope.postMail = function (data) {
        
        data.subject='Contact Form Entry';
        
        $http.post('/api/sendmail', data)
        .success(function(data) {
          // Show success message
          $scope.success_msg = 'Message sent successfully!';
          $scope.error_msg = '';
          $scope.contactForm={}; //reset fields
          $timeout(function () {
            $scope.success_msg = '';
          }, 4000);
          
        })
        .error(function(data) {
          // Show error message
          $scope.error_msg = 'Error in sending message. Please try again';
           $scope.success_msg = '';
        });
    };
    
    $scope.postSignup = function (data) {
        
        data.subject='Contact Form Entry';
        
        $http.post('/api/signup', data)
        .success(function(data) {
            //console.log(data);
            
            if (data.status=='400')
            {
                  if (data.title=='Member Exists')
                  {
                       $scope.error_msg = 'You have already subscribed to this service.';
                  } else {
                      $scope.error_msg = 'Error with subscription. Please try again';
                  }
                  $scope.success_msg = '';
                
            }else
            {
                //save into db
                $http.post('/api/subscriber', data)
               .then(
                   function(response){
                     // success callback
                   }, 
                   function(response){
                     // failure callback
                   }
                );
                
                        // Show success message
                  $scope.success_msg = 'Subscription is successfull!';
                  $scope.error_msg = '';
                  $scope.Subscriber={}; //reset fields
                
            }
            
        })
        .error(function(error) {
          // Show error message
          $scope.error_msg = 'Error with subscription. Please try again';
          $scope.success_msg = '';
        });
    };
    
    
});

app.controller("MainCtrl",function($scope,$http,$routeParams){
    //$scope.contact=contactFactory[$routeParams.id];
    
    var id =$routeParams.id;
    
    $http.get('/api/metric/get_by_kpi/' + id)
    .then(function(response) {
        $scope.metrics = response.data;
    });
    
    $http.get('/api/kpi/get_kpi_stats/' + id)
    .then(function(response) {
        //First function handles success
        $scope.best_val = response.data;
    }, function(response) {
        //Second function handles error
        console.log(response.statustext);
    });
    
    $http.get('/api/kpi/' + id)
    .then(function(response) {
        $scope.kpis = response.data;
    });
});

app.controller("CatgCtrl",function($scope,$http,$routeParams){
    
     var id =$routeParams.id;
     
    $http.get('/api/kpi/get_featured_by_category/' + id)
    .then(function(response) {
        $scope.cat_metric = response.data;
    }, function(response) {
        //Second function handles error
        console.log(response.statustext);
    });
     
});


app.controller("LoginCtrl",function($scope, $timeout, $http, $location, $routeParams, $cookies) {
    
    $scope.ShowLogin=function(){
        $('#LoginModal').modal({backdrop: 'static', keyboard: false})  ;
    }
    
    $scope.CheckLogin = function (data) {
        
        $http.post('/api/authenticate', data)
        .success(function(response) {
            //console.log(response);
            if (response.success==true)
            {
                $cookies.put('IsLogin', 'true');
                $location.path('/admin/company');
            } else 
            {
                 $scope.error_msg = 'Invalid username or password';
                 $timeout(function () {
                    $scope.error_msg = '';
                }, 4000);
            }
        })
        .error(function(error) {
          // Show server error message
          $scope.error_msg = 'Invalid username or password';
          
        });
    }
})


app.controller("RegisterCtrl",function($scope, $timeout, $http, $location, $routeParams, $cookies) {

});


app.controller("SignupCtrl",function($scope, $timeout, $http, $location, $routeParams, $cookies) {
    
    $scope.Register = function (data) {
        
        //console.log(data);
        
        if (data.password!=data.re_password){
            $scope.error_msg = 'Passwords do not match.';
            return;
        }
                    
        
        
        $http.post('/api/register', data)
        .success(function(response) {
            //console.log(response);
            if (response.success==true)
            {
                $location.path('/admin');
            } else 
            {
                 $scope.error_msg = 'Wrong entry.please try again';
                 $timeout(function () {
                    $scope.error_msg = '';
                }, 4000);
            }
        })
        .error(function(error) {
          // Show server error message
          $scope.error_msg = error.msg;
          
        });
    }
});

app.controller("CompanyCtrl",function($scope,$cookies,$http,$routeParams,companyFactory,$location,FileUploader){
    $scope.uploader = new FileUploader({ url: '/api/upload',alias: 'logo',queueLimit : 1  });
    
    var IsLogin = $cookies.get('IsLogin');
    if (IsLogin!='true') {
            $location.path('/admin');
    }
    
    $scope.Logout = function() {
        $cookies.put('IsLogin', 'false');
        $location.path('/admin');
    }
    
    $scope.fileSelected = function() {
     if ($scope.uploader.queue.length>1) {
        $scope.uploader.queue[0].remove();
     }
    };
    
    $scope.companies=companyFactory.query();
    
    $scope.messages = ''; 
    
    $scope.Refresh = function () {
    	$scope.new_company.name= '';
    	$scope.new_company.website= '';
    };

    $scope.AddItem = function(){
        $scope.uploader.clearQueue();
        $('#addModal').modal();
    }; 
    
    $scope.EditItem = function(Item){
        
        $scope.edit_company = Item;
        $('#editModal').modal();
    }; 
   
    $scope.SaveItem = function (Item) {
        
        if ($scope.uploader.queue.length>0){
            Item.logo=$scope.uploader.queue[0].file.name;
        }
        companyFactory.create(Item,function(){
            $scope.Refresh();
        });
        $scope.messages = 'New company has been created!'; 
        $scope.companies=companyFactory.query();
        
        $('#addModal').modal('hide')
        

    };
    
    $scope.UpdateItem = function (Item) {
        companyFactory.update({id: Item._id }, Item);
    	$scope.companies=companyFactory.query();
    	$('#editModal').modal('hide')
    };
    
    $scope.DeleteItem = function (Item) {
        companyFactory.destroy({id: Item });
        $scope.companies=companyFactory.query();
    };
    
    $scope.FindItem = function (Item) {
        companyFactory.find({id: Item });
    };
    
    
});

app.controller("KpiCtrl",function($scope,$location,$cookies,$http,kpiFactory,FileUploader){
    
    $scope.uploader = new FileUploader({ url: '/api/upload',alias: 'logo',queueLimit : 1  });
    
    var IsLogin = $cookies.get('IsLogin');
    if (IsLogin!='true') {
            $location.path('/admin');
    }
    
    $scope.Logout = function() {
        $cookies.put('IsLogin', 'false');
        $location.path('/admin');
    }
    
    $scope.fileSelected = function() {
     if ($scope.uploader.queue.length>1) {
        $scope.uploader.queue[0].remove();
     }
    };
    
    $scope.kpis=kpiFactory.query();
    
    $scope.messages = ''; 
    
    $scope.AddItem = function(){
        $scope.uploader.clearQueue();
        $('#addModal').modal();
    }; 
    
    $scope.EditItem = function(Item){
        $scope.edit_kpi = Item;
        $('#editModal').modal();
    }; 
   
    $scope.SaveItem = function (Item) {
        
        if ($scope.uploader.queue.length>0){
            Item.kpi_image=$scope.uploader.queue[0].file.name;
        }
        
        kpiFactory.create(Item,function(){
            $scope.new_kpi=[];
        });
        $scope.messages = 'New Kpi has been created!'; 
        $scope.kpis=kpiFactory.query();
        $('#addModal').modal('hide')
        //$scope.Refresh();

    };
    
    $scope.UpdateItem = function (Item) {
        kpiFactory.update({id: Item._id }, Item);
    	$scope.kpis=kpiFactory.query();
    	$('#editModal').modal('hide')
    };
    
    $scope.DeleteItem = function (Item) {
        kpiFactory.destroy({id: Item });
        $scope.kpis=kpiFactory.query();
    };
    
    $scope.FindItem = function (Item) {
        kpiFactory.find({id: Item });
    };

});

app.controller("RatesCtrl",function($scope,$cookies,$location,$http,metricFactory,kpiFactory,companyFactory,RateskpiFactory){
    
    var IsLogin = $cookies.get('IsLogin');
    if (IsLogin!='true') {
            $location.path('/admin');
    }
    
    $scope.Logout = function() {
        $cookies.put('IsLogin', 'false');
        $location.path('/admin');
    }
    
    $scope.metrics = RateskpiFactory.query();
    $scope.kpis=kpiFactory.query();
    $scope.companies=companyFactory.query();
    
    $scope.messages = ''; 
    
    $scope.AddItem = function(){
        $('#addModal').modal();
    }; 
    
    $scope.EditItem = function(Item){
        
        $scope.edit_metric = Item;
        $('#editModal').modal();
    }; 
   
    $scope.SaveItem = function (Item) {
        //console.log(Item);
        metricFactory.create(Item,function(){
             $scope.new_metric=[];
        });
        $scope.messages = 'New rate has been created!'; 
        $scope.metrics=RateskpiFactory.query();
        $('#addModal').modal('hide')
        

    };
    
    $scope.UpdateItem = function (Item) {
        metricFactory.update({id: Item._id }, Item);
    	$scope.metrics=RateskpiFactory.query();
    	$('#editModal').modal('hide')
    };
    
    $scope.DeleteItem = function (Item) {
        metricFactory.destroy({id: Item });
        $scope.metrics=RateskpiFactory.query();
    };
    
    $scope.FindItem = function (Item) {
        metricFactory.find({id: Item });
    };
});



app.directive('flexslider', function () {

  return {
    link: function (scope, element, attrs) {

      element.flexslider({
        animation: "slide"
      });
    }
  }
});