var express = require('express');
var passport=require('../config/passport');
//var poll_controller=require('../controllers/pollController');
var Poll=require('../models/poll');
var User=require('../models/user');

var router = express.Router();

// Initialize Passport and restore authentication state, if any, from the
// session
router.use(passport.initialize());
router.use(passport.session());

/*Authentication routes, login and logout*/
router.get('/auth/twitter',passport.authenticate('twitter'));
router.get('/auth/twitter/callback', passport.authenticate('twitter', { display:'popup',failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});
router.get('/logout',function(req,res){
req.logout();
res.redirect('/');
});

/*is the request authenticated and who is the current user */
router.get('/isloggedin',function(req,res){
    if(!req.user)
      res.json({status:"out"})
    else
      res.json({status:"in",user:req.user});
});

/* GET the list of all polls, or only those owned by a user */

router.get('/polls',function(req,res,next){
    var tosend={polls:[],total_users:0,current_user:{},trend:{}};
  //build a custom query depending on whether a user is authenticated a not  
    var query={};
  
    if(req.user){
      tosend.current_user=req.user;
      query.owner=req.user._id;
    }

    

	Poll.find(query).exec(function(err,list_polls){
    if(err) {res.json({error:err});}
    //find the trending poll, with most voters
    var nbvoters=0;
    var trending={};
    for(var i=0;i<list_polls.length;i++){
        if( nbvoters < list_polls[i].a_voters.length+list_polls[i].u_voters.length ){
            trending=list_polls[i];
        nbvoters=list_polls[i].a_voters.length+list_polls[i].u_voters.length;

        }
    }
    tosend.polls=list_polls;
	
    tosend.trend=trending;
  
    //total users count

    User.find({}).count(function(err,count){

      if(err) res.json({error:err});
      tosend.total_users=count;
      res.json(tosend);
        });

      
    });
    
});

// Get a poll's details

router.get('/poll',function(req,res,next){
  var tosend={poll:{},lo:[]};
  console.log("parameter "+req.query.id);
  Poll.findOne({_id:req.query.id}).exec(function(err,found){
       if(err) res.json({error:err});
       tosend.lo=Object.keys(found.options);
       tosend.poll=found;
       res.json(tosend);        
   });
}); 

//update a poll's information
router.post('/poll',function(req,res,next){

     Poll.findOne({_id: req.body.id},function(err,the_poll){

     
      if (err) {
         res.json({error:"Poll not found"});
       }
       else{
        if(req.user){
          if(the_poll.u_voters.indexOf(req.user.id)!==-1){
              res.json({error : "Only one vote is allowed per user or ip address"});
          }
          else{
             if (Object.keys(the_poll.options).indexOf(req.body.choice)==-1){
                 the_poll.options[req.body.choice]=0;
             }
             the_poll.options[req.body.choice]++;
             the_poll.u_voters.push(req.user.id);
             the_poll.markModified('options');
             the_poll.markModified("u_voters");
             
                    the_poll.save(function(erreur, saved_poll,num_rows){
          if(erreur) res.json({error:erreur});
          res.json({poll:saved_poll,lo:Object.keys(saved_poll.options)});
      });
             
          }
          
      }
      else {



          if(the_poll.a_voters.indexOf(req.headers["host"].split(':')[0])!==-1){
              res.json({error:"Only one vote is allowed per user or ip address"});
              
          }
          else{
              if (Object.keys(the_poll.options).indexOf(req.body.choice)==-1){
                 the_poll.options[req.body.choice]=0;
             }
              the_poll.options[req.body.choice]++;
             the_poll.a_voters.push(req.headers["host"].split(':')[0]);
             the_poll.markModified('options');
             the_poll.markModified("a_voters");
             
             the_poll.save(function(erreur, saved_poll,num_rows){
           if(erreur) res.json({error:erreur});
          res.json({poll:saved_poll,lo:Object.keys(saved_poll.options)});
      });
          }




      }
    }
      
  });
  
      
    
}); 



/*delete a poll*/
router.post('/poll/delete',function(req,res,next){
  console.log("poll to delete "+req.body.pollid);
	Poll.deleteOne({_id:req.body.pollid},function(err){
      if(err) res.json({error:err});
      res.json({error:"none"});
  });
});

//create a new poll
router.post('/newpoll',function(req,res,next){

	
   //check if the polls's title is not already used
   Poll.findOne({title:req.body.title}).exec(function(err,doc){


       if(err) res.json({error:err});
       if(doc){
           //if it is , re-render with an error message
           res.json({error:"this title is already taken"});
       }
       else{
           //if it is not, create a new poll and redirect to its detail page
           var newPoll=new Poll();
  			newPoll.owner=req.body.userid;
  			newPoll.title=req.body.title;
  			var voted_options={};
  				req.body.options.forEach(function(o){
     		voted_options[o]=0;
  			});
  			newPoll.options=voted_options;
  			newPoll.a_voters=[];
  			newPoll.u_voters=[];
  			newPoll.save(function(err,npoll){
     			if(err) res.json({error:err});
     		res.json({poll:npoll,lo:Object.keys(npoll.options)});
  			});
  
           
       }
   })
    
    //}
});

router.get('*',function(req,res){
  res.redirect('/');
})

module.exports=router;
