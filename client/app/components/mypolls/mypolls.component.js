angular.
  module("mypolls").
  component("mypolls",{
  	templateUrl : 'components/mypolls/mypolls.template.html',
  	controller : ['Polls', '$routeParams',
  	

  	function mypolls(Polls,$routeParams){
  		
  		var _this=this;
  		this.pid="";

  		this.apolls = Polls.get();


  		this.deletepoll=function(){
  			
  			var payload={pollid:_this.pid};
  			Polls.save({},payload,function(data){
  				console.log(data);
  			})


  		}
  	}

  	]


  });