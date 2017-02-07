var myApp = angular.module('myApp',['ui.router']);



myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: 'partials/partial-home.html',
            controller: function ($scope, $stateParams, $rootScope) {
            
            }  
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('tiles', {
            url: '/tiles',
            templateUrl: 'partials/partial-tiles.html',
            params: {'data': null},
            controller: 'TileController'
                   
        })

        
});


myApp.directive('goBack', function($state, $rootScope){
	return {
		scope: {
	        tile: '='
	    },
	    link: function(scope, element, attrs){

	    	$(element).hide();

	    	$(element).on('mouseover', function(){
	    		$rootScope.overrideClick = true;
	    	});

	    	$(element).on('mouseout', function(){
	    		$rootScope.overrideClick = false;
	    	});

	        $(element).on('click', function(){
	        	if(!$rootScope.tileIsFullScreen){
	        		$state.go('home').then(function(){
	        			location.reload();
	        		});
	        	}else{
	        		console.log('close');
	        	}
	        	
	        });

	        $rootScope.$watch('tileIsFullScreen', function(oldVal, newVal){
	        	if(newVal == oldVal){
	        		$(element).fadeIn();
	        	}else{
		        	if(newVal != oldVal && newVal == true){
		        		$(element).html('<h5>BACK</h5>');
		        	}else{
		        		$(element).html('<h5>CLOSE</h5>');
		        	}
	        	}

	        	
	        }, true)

	    }
	};
});




myApp.directive('description', function($state, $rootScope){
	return {
	    link: function(scope, element, attrs){

	        $rootScope.$watch('tileIsFullScreen', function(oldVal, newVal){
	        	if(newVal == oldVal){
	        		$(element).hide();
	        	}else{
		        	if(newVal != oldVal && newVal == true){
		        		$(element).fadeOut();
		        	}else{
		        		$(element).fadeIn();
		        	}
	        	}
	        	
	        }, true)

	    }
	};
});



myApp.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    // replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
        location.reload();
      };
    },
    templateUrl: 'partials/modal-template.html' 
  };
});

myApp.controller('MainController', function($scope) {
  $scope.greeting = 'Hola!';
});
