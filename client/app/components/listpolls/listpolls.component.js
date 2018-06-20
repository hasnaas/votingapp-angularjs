angular.
  module('listpolls').
  component('listpolls', {
    templateUrl: 'components/listpolls/listpolls.template.html',
    controller: ['Polls',
      function ListPollsController(Polls) {
      	var _this=this;
        this.apolls = Polls.get(function(data){
        _this.trendingtitle=data.trend.title;
        var o=data.trend.options;
        	_this.todisplay=[];
        	Object.keys(o).forEach(function(opt){
        		_this.todisplay.push({"option" : opt,"value":o[opt]});
        	});

        });
        //
        

        //this.preparedata=preparedata;
        //preparedata();
/*
        function preparedata(){
        	
        }
*/
        
      }
    ]
  });