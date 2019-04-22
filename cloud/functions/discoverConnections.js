Parse.Cloud.define('discoverConnections', function(req){
    var USER = req.user;
    var school = USER.get("school");
    var major = USER.get("major");
    var dpt = USER.get("department");
    var college = USER.get("college");

    var usersQueryBySchool = new Parse.Query('User');
    var usersQueryByCollege = new Parse.Query('User');
    var usersQueryByDepartment = new Parse.Query('User');
    var usersQueryByMajor = new Parse.Query('User');

    var connections = [];

    usersQueryBySchool.equalTo('school', school);
    usersQueryBySchool.skip(Math.floor(Math.random()*10) + 1);
    usersQueryBySchool.limit(25);
    return usersQueryBySchool.find().then(function(res){
        let sameSchool = res;
        Array.prototype.push.apply(connections, sameSchool);
        usersQueryByCollege.equalTo('college', college);
        usersQueryByCollege.skip(Math.floor(Math.random()*10) + 1)
        usersQueryByCollege.limit(25);
        return usersQueryByCollege.find().then(function(res){
            let sameCollege = res;
            Array.prototype.push.apply(connections, sameCollege);
            usersQueryByDepartment.equalTo('department', dpt);
            usersQueryByDepartment.skip(Math.floor(Math.random()*10) + 1);
            usersQueryByDepartment.limit(25);
            return usersQueryByDepartment.find().then(function(res){
                let sameDepartment = res;
                Array.prototype.push.apply(connections, sameDepartment);
                usersQueryByMajor.equalTo('major', major);
                usersQueryByMajor.notEqualTo('objectId', USER.id);
                usersQueryByMajor.skip(Math.floor(Math.random()*10) + 1);
                usersQueryByMajor.limit(25);
                return usersQueryByMajor.find().then(function(res){
                    let sameMajor = res;
                    Array.prototype.push.apply(connections, sameMajor);
                    return shuffle(connections);
                });
            });
        });
    });
})
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

function getArrayElements(number, array){
    return array.slice(0, number);
}