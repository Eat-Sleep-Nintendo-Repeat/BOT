const {client} = require('../index.js');
const ACTIVITY_POINTS_COLLECTION = require('../Models/ACTICITY POINTS.js');

function calculatePoints() {
    //fetch database and get the total of all values
    ACTIVITY_POINTS_COLLECTION.find({}, (err, docs) => {
        if (err) console.log(err);
        else {
            var total = 0;
            docs.forEach(doc => {
                total += doc.value;
            });
            
            //check if the total is higher then 500
            // if (total < 500) return;

            //fetch all member and loop them
            client.guilds.cache.get("585511241628516352").members.cache.forEach(member => {
                //fetch the member's points
                var membertotal = 0;
                docs.filter(doc => doc.member == member.id).forEach(doc => {
                    membertotal += doc.value;
                })

                //check persentage of member
                var persentage = membertotal / total;

                //remove all roles that dont belong
                function setroles(roletokeep) {
                    const acttivityroles = ["948288878471708733", "948288751052939305", "948288755586977832", "948288753301065798"]
                    var roles = member.roles.cache;
                    if (roles.has(roletokeep)) return;
                    if (roletokeep) member.roles.add(roletokeep);

                    roles.filter(r => acttivityroles.includes(r.id)).forEach(role => {
                        if (role.id != `${roletokeep ? roletokeep : ""}`) {
                            member.roles.remove(role.id);
                        }
                    })
                }

                if (0.85 < persentage) {
                    setroles("948288878471708733");
                }
                else if (0.75 < persentage) {
                    setroles("948288751052939305");
                }
                else if (0.5 < persentage) {
                    setroles("948288753301065798");
                }
                else if (0.1 < persentage) {
                    setroles("948288755586977832")
                }
                else {
                    setroles(null);
                }
                
            });


        }
    }
    );
}

// run calculatePoints every midnight
const schedule = require('node-schedule');
    const job = schedule.scheduleJob('0 0 * * *', function(){
    calculatePoints();
  });