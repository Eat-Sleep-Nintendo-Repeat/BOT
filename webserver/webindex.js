const express = require('express')
var path = require("path");

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

app.get("/coins/:id", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")
    var mdb = await MEMBER.findOne({"id": req.params.id})
    if (!mdb) return res.send("DB INDEX not found")
    mdb.currencys.coins.log = mdb.currencys.coins.log.reverse()
    var type = require("../Modules/member-type-to-word")(mdb.type)

    
    res.render("CARD_coincard", {member: mdb, pb: mdb.informations.avatar, type})

})

app.get("/rank/:id", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")
    var mdb = await MEMBER.findOne({"id": req.params.id})
    if (!mdb) return res.send("DB INDEX not found")
    mdb.currencys.ranks.nextxp = mdb.currencys.ranks.rank * 5;
    var type = require("../Modules/member-type-to-word")(mdb.type)

    
    
    res.render("CARD_rankcard", {raw: true, member: mdb, pb: mdb.informations.avatar, type})
   

})

app.get("/ranklist", async (req, res) => {
    var MEMBER = require("../Models/MEMBER")

    //get the first 10 Member sorted by Ranks
    var rankdata = await MEMBER.find().sort({"currencys.ranks.rank": -1})
     var top10 = []

     rankdata.slice(0, 10).forEach(m => {
        var memberedit = m

            var nondbinformation = { 
            tag: require("../Modules/member-type-to-word")(m.type),
            place: rankdata.indexOf(m) + 1
         }
         
        //  console.log(m.extras)
         top10.push({db: m, nondbinformation})
     })


    res.render("CARD_ranklistcard", {raw: true, ranklist: top10})

})

app.listen(7869, () => {
    console.log("[CARD RENDERER] Listenig to Port 7869")
})