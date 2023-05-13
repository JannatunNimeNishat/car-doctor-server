const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


//middleware
app.use(cors())
app.use(express.json())




// mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oth2isl.mongodb.net/?retryWrites=true&w=majority`


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
        await client.connect();

        //service 
        const serviceCollection = client.db('carDoctor').collection('services');

        //booking
        const bookingCollection = client.db('carDoctor').collection('bookings')



                    //services

        //get all services data
        app.get('/services', async(req,res)=>{
            const cursor = serviceCollection.find();
            const result = await cursor.toArray()
            console.log(result);
            res.send(result);
        })

        //get specific service
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id;

            const query = {_id: new ObjectId(id)}
            const options = {
                projection:{title:1,price:1,service_id:1, img:1}
            }
            const result = await serviceCollection.findOne(query,options)
          
            res.send(result);
        })

                        //booking

        app.post('/bookings', async(req,res)=>{
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            
            console.log(booking);
            res.send(result);
        })

        //get user specific data
        app.get('/bookings', async(req,res)=>{
            console.log(req.query);
            let query={};
            if(req.query?.email){
                query = {email: req.query.email};
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })

        //update a specific booking
        // put vs patch google 
        app.patch('/bookings/:id', async(req,res)=>{
            const id = req.params.id;
            const filter= {_id: new ObjectId(id)}
            const updatedBooking = req.body;
          // console.log(updatedBooking);
             const updateDoc = {
                $set: {
                  status: updatedBooking.status
                },
              };

              const result = await bookingCollection.updateOne(filter,updateDoc)
              //console.log(result);
              res.send(result);

        })

        //delete a specific delete
        app.delete('/bookings/:id',async(req,res)=>{
            const id = req.params.id;
            const query= {_id: new ObjectId(id)}
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
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









app.get('/', (req, res) => {
    res.send('Car doctor server is running')
})

app.listen(port, () => {
    console.log(`Car doctor is running at port: ${port}`);
})
