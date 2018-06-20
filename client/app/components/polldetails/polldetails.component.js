angular.
	module('polldetails').
	component('polldetails',{
		templateUrl : 'components/polldetails/polldetails.template.html',
		controller : ['$routeParams','$http', '$location',
		  function PollDetailsController($routeParams,$http,$location){
		  	
		  	this.selection="";
		  	this.customoption="";
		  	this.validatecustom="[a-zA-Z0-9' ']*";
		  	

		  	
		  	var _this=this;
            var parameter={id:$routeParams.id};

		  	$http({
		  		url:'/poll',
		  		method:'GET',
		  		params: parameter
		  	}).success(function(data){
		  		_this.thepoll=data;
		  		_this.todisplay=[];
		  		Object.keys(data.poll.options).forEach(function(i){
    			_this.todisplay.push({"option" : i, "value" : data.poll.options[i]});
				});


		  		$http.get("/isloggedin").success(function(response){
    				if(response.status=="in"){
    					if(response.user._id==_this.thepoll.poll.owner)
    						_this.isownerlogged=true;
    					
    					else
    						_this.isownerlogged=false;
      					
    				}
    				else
					      _this.isownerlogged=false;
  					}).error(function(error){
    				console.log(error);
  					});
		  	}).error(function(error){
		  		console.log(error);
		  	})
	  	

		  	this.updatepoll=function(){
		  	
		  		var payload={choice:"",id:$routeParams.id};
		  		if(_this.selection=="custom"){
		  			payload.choice=_this.customoption;

		  		}
		  		else{
		  			payload.choice=_this.selection;
		  		}
		  		
		  		$http({
		  			method:'POST',
		  			url : '/poll',
		  			data : payload
		  		}).success(function(data){
		  			if(data.error)
		  				alert(data.error);
		  			else{
		  			_this.thepoll=data;	
		  			_this.todisplay=[];
			  		Object.keys(data.poll.options).forEach(function(i){
    				_this.todisplay.push({"option" : i, "value" : data.poll.options[i]});
					});

		  			}
		  			
		  			_this.selection="";

		  		}).error(function(error){
		  			console.log(error);
		  			_this.selection="";


		  		});
		  		
		  	}

		  	this.deletepoll=function(){

  			var payload={pollid:_this.thepoll.poll._id};
  			
  			$http({

  				method: 'POST',
  				url : '/poll/delete',
  				data : payload
  			}).success(function(data){
  				console.log(data);
  				if(data.error=="none"){
  					$location.path('/');
  				}
  				else{
  					alert(data.error);
  				}
  			}).error(function(error){
  				console.log(error);
  			});

		  	}
		  }
		]

	});