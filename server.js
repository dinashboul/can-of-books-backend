'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // 0 - import mongoose
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT||3001; 

//http:localhost:3001/test
app.get('/test', (request, response) => {
response.send('test request received')

})
// step 1
mongoose.connect('mongodb://Class-301:1234@ac-cuyt8bs-shard-00-00.uphaivt.mongodb.net:27017,ac-cuyt8bs-shard-00-01.uphaivt.mongodb.net:27017,ac-cuyt8bs-shard-00-02.uphaivt.mongodb.net:27017/?ssl=true&replicaSet=atlas-11s1u4-shard-0&authSource=admin&retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});

const Book = new mongoose.Schema({ //define the schema (structure)
  title: String,
  description: String,
  status: String,
  email : String,
});
const ModelBooks = mongoose.model('books', Book); //compile the schem into a model           
//step 2
// let seedData=require('./ModelScema');
// app.get('/seedData', seedData);

async function seedData(){
  const firstBook = new ModelBooks({
      title: "The Prophet and Other Writings",
      description: "Part of the Knickerbocker Classics series, a modern design makes this timeless book a perfect travel companion.",
      status: "Available",
      email:"dinaalshboul@gmail.com"
  })

  const secondBook = new ModelBooks({
      title: "The Silent Patient",
      description: "The Richard and Judy bookclub pick and Sunday Times Bestseller: The record-breaking, multimillion copy Sunday Times bestselling thriller and Richard & Judy book club pick",
      status: "Not Available",
      email:"dinaalshboul@gmail.com"

  })

  const thirdBook = new ModelBooks({
      title: "The Time Keeper",
      description: "From the author who's inspired millions worldwide with books like Tuesdays with Morrie and The Five People You Meet in Heaven comes his most imaginative novel yet, The Time Keeper--a compelling fable about the first man on Earth to count the hours.",
      status: "Avilable",
      email:"dinaalshboul@gmail.com"

  })

  await firstBook.save();
  await secondBook.save();
  await thirdBook.save();
}
 
// seedData();
app.get('/books', getBooksHandler)
app.get('/test',testHandler);
// http://localhost:3001/addBook
app.post('/addBook',addBookHandler);
//http://localhost:3001/deleteBook/:id
app.delete('/deleteBook/:id',deleteBookHandler);
//http://localhost:3001/books

app.put('/updateBook/:id',updateBookHandler);

function testHandler(req,res) {
  res.status(200).send("You are requesting the test route");
}




function getBooksHandler(req,res) {
    const email= req.query.email;
    console.log("my email is ",email);
  ModelBooks.find({},(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      else
      {
          console.log(result);
          res.send(result);
      }
  })
}
 
async function addBookHandler(req,res) {
  console.log(req.body);
  
  const {bookTitle,bookDescription,bookStatus,email} = req.body; //Destructuring assignment
  await ModelBooks.create({
      title : bookTitle,
      description : bookDescription,
      status:bookStatus,
      email:email,
  });

  ModelBooks.find({email:email},(err,result)=>{
      if(err)
      {
          console.log(err);
      }
      else
      {
          // console.log(result);
          res.send(result);
      }
  })
}

function deleteBookHandler(req,res) {
  const bookId = req.params.id;
  const email= req.query.email;
  ModelBooks.deleteOne({_id:bookId},(err,result)=>{
      
    ModelBooks.find({email:email},(err,result)=>{
          if(err)
          {
              console.log(err);
          }
          else
          {
              // console.log(result);
              res.send(result);
          }
      })

    })
  }

  function updateBookHandler(req,res){
    const id = req.params.id;
    const {title,description,status,email} = req.body; //Destructuring assignment
    console.log(req.body);
    ModelBooks.findByIdAndUpdate(id,{title,description,status,email},(err,result)=>{
        if(err) {
            console.log(err);
        }
        else {
          ModelBooks.find({email:email},(err,result)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    // console.log(result);
                    res.send(result);
                }
            })
        }
    })

}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
