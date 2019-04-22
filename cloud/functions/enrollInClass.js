Parse.Cloud.define("enrollInClass", function(req){
    // first get the user information and class level
    var section_id = req.params.id;
    var USER = req.user;

    // first thing to do is check if user is subscriber in order to enroll in a class

    var sectionQuery = new Parse.Query('Section');
    var msg = new Parse.Object();
    sectionQuery.equalTo('objectId', section_id);
    return sectionQuery.find().then(function(sections){
        var section = sections[0];
        var enrolledStudents = section.relation('currentStudents');
        var course = section.get('course');
        var currentCourses = USER.relation('currentCourses');
        var currentSections = USER.relation('currentSections');
        var currentCoursesQuery = currentCourses.query();

        currentCoursesQuery.equalTo("objectId", course.id);
        return currentCoursesQuery.find().then(function(res){
            if(res.length > 0){
                msg.set('alert', "You tried to enroll in "+res[0].get('name')+" you are already in it!");
                msg.set('title', 'Schola');
                msg.set('text', 'This is the message fam');
                msg.set('label', 'test');
                msg.set('badge', 'increment');
                q = new Parse.Query(Parse.Installation);
                //q.equalTo('user', USER);

                Parse.Push.send({
                    id: msg.id,
                    where: q,
                    data: {
                        alert: msg.get('alert'),
                        title: msg.get('title'),
                        body: msg.get('text'),
                        label: msg.get('label'),
                        badge: msg.get('badge'),
                        count: msg.id,
                        style: 'inbox',
                        notId: USER.id,//Math.floor(Math.random()*10),
                        coldstart: true,
                        collapse_key: msg.id,
                        actions: [
                            {
                              "icon": "emailGuests",
                              "title": "EMAIL GUESTS",
                              "callback": "emailGuests",
                              "foreground": false,
                              "inline": true,
                              "replyLabel": "Enter your reply here"
                            },
                            {
                              "icon": "snooze",
                              "title": "SNOOZE",
                              "callback": "snooze",
                              "foreground": false
                            }
                        ]
                    },
                    push_time: req.params.date
                },{useMasterKey: true},{
                    success: function(j){
                    },
                    error: function(e){
                    }
                })
                throw new Error("You are already enrolled in the class");
            } else {
                enrolledStudents.add(USER);
                currentCourses.add(course);
                currentSections.add(section);
                section.save();
                return USER.save({}, {useMasterKey: true}).then(function(e){
                    return USER;
                });
            }

        })
    },
    function(e){
        return e;
    });

})
