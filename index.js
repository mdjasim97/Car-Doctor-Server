const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wukjrsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();



        const database = client.db("carDoctor")
        const servicesCollection = database.collection("services")
        const bookingCollection = database.collection("booking")


        app.get("/services", async(req, res) => {
            const cursor = servicesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.get("/services/:id", async(req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }


            const options = {
                projection: {
                    title: 1,
                    price: 1,
                    Imgage: 1
                }
            }

            const result = await servicesCollection.findOne(query, options)
            res.send(result)
        })


        app.get("/bookings", async(req, res) => {
            // console.log(req.query.email)
            let query = {};
            if (req.query.email) {
                query = { Email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })


        app.post("/booking", async(req, res) => {
            const reqData = req.body;
            // console.log(reqData)
            const result = await bookingCollection.insertOne(reqData)
            res.send(result)
        })


        app.patch("/update/:id", async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const reqBody = req.body;
            console.log(reqBody)



            const updateData = {
                $set: {
                    status: reqBody.status
                }
            }

            const result = await bookingCollection.updateOne(query, updateData)
            res.send(result)

        })


        app.delete("/booking/:id", async(req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.use("/", (req, res) => {
    res.send("Car Doctore Server start")
})


app.listen(port, () => {
    console.log(`Server running port is : ${port}`)
})