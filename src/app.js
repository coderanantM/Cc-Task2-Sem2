const express = require('express')
var bodyParser = require('body-parser')
require("../src/db/connection");
const Book_rating = require("../src/models/books");
const User = require("../src/models/user");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const app = express()
const port = process.env.PORT || 5000

dotenv.config();

async function validateToken (request) {
    const token = request.header('Authorization')
    if (!token) {
        return false
    }
    try {
        const decoded = jwt.verify(token, "anantntntntntatnmamg")
        return decoded
    } catch (err) {
        return false
    }
}

app.post("/book_rating", jsonParser, async (req, res) =>{
    try {
        const validated = await validateToken(req);
        if (!validated)
            return res.status(403).send();
            
      const addingBookRecords = new Book_rating(req.body)
      const insertedBookRecords =  await addingBookRecords.save();
      res.status(201).send(insertedBookRecords);
    }catch (e){
        res.status(400).send(e)
    }

})

// get all books
app.get('/book_rating', async (req, res) => {
    const validated = await validateToken(req);
        if (!validated)
            return res.status(403).send();

    const bookRecords = await Book_rating.find({}).sort({"ranking":"desc"});
    res.status(200).send(bookRecords)    
})

app.get("/book_rating/:id", async (req, res) =>{

    const validated = await validateToken(req);
        if (!validated)
            return res.status(403).send();

    try {
        console.log(req.params, req.params.id)
      const id = req.params.id;
      const getBook = await Book_rating.findById(id);
      res.send(getBook);
    }catch(e){
        console.log(e);
        res.status(400).send(e)
    }

})
app.patch("/book_rating/:id", jsonParser, async (req, res) =>{

    const validated = await validateToken(req);
        if (!validated)
            return res.status(403).send();

    try {
      const id= req.params.id;
      const getBook = await Book_rating.findByIdAndUpdate(id, req.body);
      res.send(getBook);
    }catch(e){
        res.status(400).send(e)
    }
})

app.delete("/book_rating/:id", async (req, res) => {

    const validated = await validateToken(req);
        if (!validated)
            return res.status(403).send();

    try {
        await Book_rating.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }catch(e){
        res.status(400).send(e)
    }

})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/user/generateToken", jsonParser, async (req, res) => {

    const validated = await validateToken(req);
        if (!validated)
            return res.status(403).send();

    try {
        const user = await User.findOne({Username: req.body.username});
         user.comparePassword(req.body.password, function (err, isPass) {
                if (err) throw err;
                if (isPass) {
                    const data = {
                        time: Date(),
                        userId: req.body.Username,
                    }

                    let jwtSecretKey = "anantntntntntatnmamg";
                    const token = jwt.sign(data, jwtSecretKey);

                    res.send({"access": token});
                }
                else {
                    res.status(401).send();
                }
            });
    } catch (e) {
        res.status(400).send(e)
        console.log(e);
    }
});