Parse.Cloud.afterSave("ConnectionRequest", function(req, res){
    var request = req.object;

    var from = request.get('from');
    var to = request.get('to');

    var query = new Parse.Query(Parse.Installation);
    query.equalTo('user', to);

    var message = 'Sent you a connection request';

    Parse.Push.send(
        {
            id: request.id,
            where: query,
            data: {
                title: request.get('fromName'),
                body: message,
                label: 'connectionRequest',
                badge: 'increment',
                notId: Math.floor(Math.random()*100)+1,
                coldstart: true,
                collapse_key: request.id,
                actions: [
                    {
                        "title": "ACCEPT",
                        "callback": "accept",
                        "foreground": false
                    },
                    {
                        "title": "DECLINE",
                        "callback": "decline",
                        "foreground": false
                    }
                ]
            },
            push_time: new Date()
        }, {useMasterKey: true}, {
            success: function(obj){
                console.log(obj);
            },
            error: function(err){
                console.log(err);
            }
        }
    );
    
});

Parse.Cloud.beforeSave("ConnectionRequest", function(req, res){
    var request = req.object;

    var from = request.get('from');
    var to = request.get('to');

    //check if connection request already exists

    var q = new Parse.Query('ConnectionRequest');
    q.equalTo('from', from);
    q.equalTo('to', to);

    var q2 = new Parse.Query('ConnectionRequest');
    q2.equalTo('from', to);
    q2.equalTo('from', from);

    var mainQuery = Parse.Query.or(q, q2);

    return mainQuery.find().then(
        function (obj){
            if(obj.length > 0){
                return false;
            } else {
                return true;
            }
        }
    )

    
});