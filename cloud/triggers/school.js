Parse.Cloud.beforeSave("School", function(req, res){
    var school = req.object;
    var schoolCode = school.get('schoolCode');
  
    var query =  new Parse.Query('School');
    query.equalTo('schoolCode', schoolCode);
  
    query.find().then(function(obj){
      res.error("No again!!");
    }, function(error){
      res.success();
    });
  
  });