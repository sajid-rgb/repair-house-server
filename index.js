const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 5000
const app = express()
const dotenv = require('dotenv')
dotenv.config()
app.use(cors())
app.use(bodyParser.json())
app.get('/',(req,res)=>{
    res.send('Thank you')
})

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rnyig.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("repair-service").collection("service");
  const infoCollection = client.db("repair-service").collection("info");
  const adminCollection = client.db("repair-service").collection("admin");
  const reviewCollection = client.db("repair-service").collection("review");
  console.log('connected');
  app.post('/addService',(req,res)=>{
      collection.insertOne(req.body)
      .then(result=>{
          console.log(result);
      })

  })
  app.get('/services',(req,res)=>{
      collection.find({}).toArray((err,documents)=>{
          res.send(documents)
      })
  })
  app.get('/services/:id',(req,res)=>{
    collection.find({_id:ObjectID(req.params.id)}).toArray((err,documents)=>{
        res.send(documents)
    })
})
app.delete('/delete/:id',(req,res)=>{
    collection.deleteOne({_id:ObjectID(req.params.id)})
})
app.post('/addInfo',(req,res)=>{
    console.log(req.body);
    infoCollection.insertOne(req.body)
    .then(result=>{
        
    })

})
app.get('/userInfos',(req,res)=>{
    infoCollection.find({}).toArray((err,documents)=>{
        res.send(documents)
    })
})
app.post('/addAdmin',(req,res)=>{
    adminCollection.insertOne(req.body)

})
app.get('/admin',(req,res)=>{
    adminCollection.find({}).toArray((err,documents)=>{
        res.send(documents)
    })
})
app.post('/review',(req,res)=>{
   reviewCollection.insertOne(req.body)
   .then(result=>{
       console.log(result);
   })
})
app.get('/reviews',(req,res)=>{
    reviewCollection.find({}).toArray((err,documents)=>{
        res.send(documents)
    })
 })

 app.patch('/status/:id',(req,res)=>{
     console.log(req.body.statusChange);
     infoCollection.updateOne({_id:ObjectID(req.params.id)},{
        $set:{status:req.body.statusChange}
     })
     
 })
});

app.listen(process.env.PORT || port,()=>{
    console.log('welcome');
})