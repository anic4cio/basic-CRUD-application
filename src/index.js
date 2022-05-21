const express = require("express")
const mongo = require("mongodb").MongoClient
const mongodb = require("mongodb")

const url = "mongodb://localhost:27017"
const app = express()

let db, universities

app.use(express.json())
app.listen(3000, () => console.log("Server ready"))

mongo.connect(
    url,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) {
            console.error(err)
            return
        }
        db = client.db("consumer-universities")
        universities = db.collection("universities")
})

app.get("/universities", (req, res) => {
    universities.find({}).toArray((err, items) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ universities: items })
    })
})

app.post("/universities", (req, res) => {
    universities.insertOne({
        alpha_two_code: req.body.alpha_two_code,
        web_pages: req.body.web_pages,
        name: req.body.name,
        country: req.body.country,
        domains: req.body.domains,
        state_province: req.body.state_province,
        },
        (err, result) => {
            if (err) {
                console.error(err)
                res.status(500).json({ err: err })
                return
            }
            res.status(200).json ({ ok: true })
        })
})

app.put("/universities", (req, res) => {
    universities.updateOne(
        { "_id": req.body._id },
        { $set: 
            {
                alpha_two_code: req.body.alpha_two_code,
                web_pages: req.body.web_pages,
                name: req.body.name,
                country: req.body.country,
                domains: req.body.domains,
                state_province: req.body.state_province,
            }},
            { upsert: true },
        (err, result) => {
            if (err) {
                console.error(err)
                res.status(500).json({ err: err })
                return
            }
            res.status(200).json ({ ok: true })
        })
})

app.delete("/universities/:id", (req, res) => {
    universities.deleteOne({_id: new mongodb.ObjectId( req.params.id )},
        (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ ok: true })
    })
})