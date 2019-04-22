Parse.Cloud.afterSave("Message", function(req, res){
    var message = req.object;

    var from = message.get('from');
    var chat = message.get('chat');

    var toQuery = chat.relation('members').query();
    toQuery.notEqualTo('objectId', from.id);

    var q = new Parse.Query(Parse.Installation).matchesQuery('user', toQuery);

    var notification = {
        id: message.id,
        where: q,
        data: {
            title: message.get('title'),
            body: message.get('body'),
            label: 'message',
            badge: 'increment',
            style: 'inbox',
            notId: chat.id,//Math.floor(Math.random()*10),
            coldstart: true,
            collapse_key: message.id,
            actions: [
                {
                    "title": "REPLY",
                    "callback": "reply",
                    "foreground": false,
                    "inline": true,
                    "replyLabel": "Enter your reply here"
                },
                {
                    "title": "MARK AS READ",
                    "callback": "markRead",
                    "foreground": false
                }
            ]
        },
        push_time: new Date()
    }

    Parse.Cloud.run('sendPush', notification);
  
});