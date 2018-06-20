angular.
  module('createpoll').
  component('createpoll',{
			templateUrl : 'components/createpoll/createpoll.template.html',
			controller : ['$http','$location',
			function CreatePollController($http,$location){
				this.title="";
				this.options="";
				this.validatetitle="[a-zA-Z0-9' ']*";
				this.validateoptions="[a-zA-Z0-9' ',]*";

				var _this=this;
				this.makepoll=function(){

					var payload={title:"",options:[],userid:""};
					payload.title=_this.title;
					payload.options=_this.options.split(',');
					
					$http.get("/isloggedin").success(function(response){
    				if(response.status=="in"){
    					payload.userid=response.user._id;
    					$http({
						url:'/newpoll',
						method:'POST',
						data:payload
					}).success(function(data){
						if(data.error)
							alert(data.error);
						else{
							//console.log(data);
							$location.path("/poll/"+data.poll._id);
						}
						this.title="";
						this.options="";
					}).error(function(error){
						console.log(error);
						this.title="";
						this.options="";
					});
					
    				}
    				else
					     alert("You should login to make a new poll!");
  					}).error(function(error){
    				console.log(error);
  					});

					
				}
			}
			]
		});