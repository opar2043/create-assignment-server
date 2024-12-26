require('dotenv').config();

const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();


// middleware 
app.use(express.json());
app.use(cors());


// zB31awhyLFjBjNGC
// campgain



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xfvkq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);

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
    // await client.connect();
   
    const campgainCollection = client.db('campgainDb').collection('Assignment')
    const docsCollection = client.db('campgainDb').collection('docs')

    // assignment   

   app.post('/assignment',async(req,res)=>{
    const newAssignment = req.body;
    const result = await campgainCollection.insertOne(newAssignment);
    res.send(result)
   })

   

   app.get('/assignment', async(req,res)=>{
    const newAssignment = campgainCollection.find();
    const result = await newAssignment.toArray();
    res.send(result)
   })

   app.get('/allassignment', async(req,res)=>{
    const filter = req.query.filter;
    const query = {};
    if(filter){
         query.difficulty = filter
    }
    const newAssignment = campgainCollection.find(query);
    const result = await newAssignment.toArray();
    res.send(result)
   })


   app.delete('/assignment/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await campgainCollection.deleteOne(query);
    res.send(result)
   })

   app.get('/docs/:email',async(req,res)=>{
    const email = req.params.email;
    const query = { email: email };
    const result = await campgainCollection.find(query).toArray();
    res.send(result)
   })

   app.put('/assignment/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const updateData = req.body;
    const update ={
      $set: {
        title : updateData.title,
        description: updateData.description,
        marks: updateData.marks,
        thumbnail : updateData.thumbnail,
        difficulty : updateData.difficulty,
        dueDate : updateData.dueDate
      },
    }
    const result = await campgainCollection.updateOne(filter,update)
    res.send(result)
   })

    
   //  docs collection

   app.post('/docs',async(req,res)=>{
    const newDocs = req.body;
    const result = await docsCollection.insertOne(newDocs);
    res.send(result)
   })

   app.get('/docs', async(req,res)=>{
    const newDocs = docsCollection.find();
    const result = await newDocs.toArray();
    res.send(result)
   })

   app.put('/docs/:id',async(req,res)=>{
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)};
    const updateData = req.body; 

    console.log(updateData.getMarks, 'marks');
    console.log(updateData.feedback, 'feedback');

    const update ={
      $set: {
        getMarks : updateData.getMarks,
        feedback: updateData.feedback,
        staus: updateData.staus,
      },
      
    }

    const result = await docsCollection.updateOne(filter,update)
    res.send(result)
   })

  

  

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
   console.log('hello server ');
   res.send('the server is running')
})

app.listen(port,(req,res)=>{
    console.log('port is running:',port);
})