Parse.Cloud.define("discoverClasses", function(req){
    // first get the user information and class level
    var USER = req.user;
    var schoolId = USER.get("school").id;
    var majorId = USER.get("major").id;
    var dptId = USER.get("department");
    var level = USER.get("classification");
    var coursesTakenQuery = USER.relation("coursesTaken").query();
    var currentCourses = USER.relation("currentCourses");
    var currentCoursesQuery = currentCourses.query();

    var queryBySchool = new Parse.Query("School");
    var queryByMajor = new Parse.Query("Major");
    var queryByDepartment = new Parse.Query("Course");

    queryBySchool.equalTo("objectId", schoolId);
    queryByMajor.equalTo("objectId", majorId);
    if (level <= 2) {
        return queryBySchool.find().then(function(uni){//get the school
            var school = uni[0];
            var coreCurriculum = school.relation("coreCurriculum");
            var coreQuery = coreCurriculum.query();
            coreQuery.doesNotMatchKeyInQuery("objectId", "objectId",coursesTakenQuery);
            coreQuery.doesNotMatchKeyInQuery("objectId", "objectId", currentCoursesQuery);
            coreQuery.limit(200);
            return coreQuery.find().then(function(courses){
                var rand = shuffle(courses);
                var coreCourses = getArrayElements(50, rand);
                return queryByMajor.find().then(function(major){
                        var maj = major[0];
                        var majorCurriculum = maj.relation("curriculum");
                        var majorCoreQuery = majorCurriculum.query();
                        majorCoreQuery.doesNotMatchKeyInQuery("objectId", "objectId", coreQuery);
                        majorCoreQuery.equalTo("courseLevel", toString(level));
                        majorCoreQuery.equalTo("courseLevel", toString(level+1));
                        majorCoreQuery.limit(100);
                        return majorCoreQuery.find().then(function(courses){
                            var majorCourses = shuffle(courses);
                            queryByDepartment.equalTo("department", dptId);
                            queryByDepartment.doesNotMatchKeyInQuery("objectId", "objectId", majorCoreQuery);
                            queryByDepartment.equalTo("courseLevel", toString(level));
                            queryByDepartment.equalTo("courseLevel", toString(level+1));
                            queryByDepartment.limit(100);
                            return queryByDepartment.find().then(function(courses){
                                var departmentCourses = shuffle(courses);
                                var ALLCOURSES = majorCourses.concat(departmentCourses).concat(coreCourses);
                                return shuffle(ALLCOURSES);
                            })
                        })
                    }
                )
            })
        })
    } else if (level >=3) {
        return queryByMajor.find().then(function(major){
            var maj = major[0];
            var majorCurriculum = maj.relation("curriculum");
            var majorCoreQuery = majorCurriculum.query();
            majorCoreQuery.notEqualTo("courseLevel", "1");
            majorCoreQuery.notEqualTo("courseLevel", "2");
            majorCoreQuery.doesNotMatchKeyInQuery("objectId", "objectId", currentCoursesQuery);
            majorCoreQuery.limit(100);
            return majorCoreQuery.find().then(function(courses){
                var majorCourses = shuffle(courses);
                queryByDepartment.equalTo("department", dptId);
                queryByDepartment.doesNotMatchKeyInQuery("objectId", "objectId", majorCoreQuery);
                queryByDepartment.notEqualTo("courseLevel", "1");
                queryByDepartment.notEqualTo("courseLevel", "2");
                queryByDepartment.limit(20);
                return queryByDepartment.find().then(function(dptcourses){
                    var departmentCourses = getArrayElements(100, shuffle(dptcourses));
                    var ALLCOURSES = majorCourses.concat(departmentCourses);
                    return shuffle(ALLCOURSES);
                })
            })
        })
    } else {

    }

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

/*
    query.limit(6000);
    query.find().then(function(courses){
        for(var i=0; i<courses.length; i++){
            course = courses[i];
            let courseid = course.get("courseid");
            let number = courseid.substr(-4);
            lev = number[0];
            course.set("courseLevel", lev);
            course.save();
        }
    })


    var instructorQuery = new Parse.Query("Instructor");
    var courseQuery = new Parse.Query("Course");

    instructorQuery.exists("name");
    instructorQuery.limit(1000);
    return instructorQuery.find().then(function(objs){
        for(var i = 0; i<objs.length; i++){
            let instructor = objs[i];
            let relation = instructor.relation("sections");
            sectionQeury = relation.query();
            sectionQeury.limit(30);
            sectionQeury.find().then(function(sections){
                for(var sec = 0; sec<sections.length; sec++){
                    let section = sections[sec];
                    let co = section.get("course");
                    courseQuery.equalTo("objectId", co.id);
                    courseQuery.first();
                    courseQuery.find().then(function(courses){
                        let course = courses[0];
                        course.addUnique("instructors", instructor);
                        course.save();
                    })
                }
            })
        }
        return {"code": 100, "message": "Well Done!"};
    })

*/

/*
Algorithms drivers;
1. Based on School (if level 1 & 2)
2. Based on Major
3. Based on Department 

*/