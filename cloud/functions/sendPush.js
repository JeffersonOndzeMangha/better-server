Parse.Cloud.define('sendPush', function(notification, response){
    Parse.Push.send(
        {
            id: notification.id,
            channels: notification.to.id,
            data: notification.data,
            push_time: notification.push_time
        },{useMasterKey: true},{
            success: function(s){
                console.log("PUSHED MESSAGE!")
                console.log(s);
            },
            error: function(e){
                return response.error();
            }
        }
    )
});

// var msg = {
//     id: msg.id,
//     where: q,
//     data: {
//         alert: msg.get('alert'),
//         title: msg.get('title'),
//         body: msg.get('text'),
//         label: msg.get('label'),
//         badge: msg.get('badge'),
//         count: msg.id,
//         style: 'inbox',
//         notId: USER.id,//Math.floor(Math.random()*10),
//         coldstart: true,
//         collapse_key: msg.id,
        // actions: [
        //     {
        //     "icon": "emailGuests",
        //     "title": "EMAIL GUESTS",
        //     "callback": "emailGuests",
        //     "foreground": false,
        //     "inline": true,
        //     "replyLabel": "Enter your reply here"
        //     },
        //     {
        //     "icon": "snooze",
        //     "title": "SNOOZE",
        //     "callback": "snooze",
        //     "foreground": false
        //     }
        // ]
//     },
//     push_time: req.params.date
// }