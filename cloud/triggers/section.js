Parse.Cloud.beforeSave("Section", function(req, res){
    var section = req.object;
    var id = section.get("sectionid");
  
    var query =  new Parse.Query('Section');
    query.equalTo("sectionid", id);
    
    query.find().then(function(obj){
      res.error("No again!!");
    }, function(error){
      res.success();
    });
  
  })