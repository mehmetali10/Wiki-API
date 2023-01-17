
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1/wikiDB",{
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

const articles = [
    new Article({
        "title" : "API",
        "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
    }),
    
    
    new Article({
        "title" : "Bootstrap",
        "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
    }),
    
    
    new Article({
        "title" : "DOM",
        "content" : "The Document Object Model is like an API for interacting with our HTML"
    })
];

app.route("/articles")
    .get(function(req,res){
        Article.count({}, function(err, count){
            if(err)
            {
                res.send(err);
            }
            else if(count == 0)
            {
                Article.insertMany(articles);
                res.redirect("/articles");
            }
            else
            {
                Article.find((err, foundArticle)=>{
                    if(err)
                        res.send(err);
                    else 
                        res.send(foundArticle);
                });
            }
        });
    })
    
    .post(function(req,res){
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });
    
        article.save(function(err){
            if(err)
                res.send(err);
            else    
                res.json(article);
        });
    })

    .delete((req,res) =>{
        Article.deleteMany((err)=>{
            if(err)
                res.send(err);
            res.send("all of the articles has been deleted successfully");
            });
    })


app.route("/articles/:articleTitle")
    .get(function(req, res){
        const articleTitle = req.params.articleTitle;
        Article.findOne({title: articleTitle}, function(err, foundArticle){
            if(foundArticle)
                res.send(foundArticle);
            else    
                res.send("No article founds");
        });
    })

    .put((req,res)=>{
         Article.updateOne(
            {title: req.params.articleTitle}, //conditions
            {
                title: req.body.title, 
                content: req.body.content
            },              
            function (err) {
                if (err){
                    res.send(err)
                }
                else{
                    res.send("Updated Docs");
                }
            });
    })

    .patch(function(req, res){
        const ud = req.body;
        Article.findByIdAndUpdate(
            {_id: req.params.id},
            {ud },
            {new: true},
            function(err, article){
                if(err)
                    res.send(err);
                else    
                    res.send("patch success " + article);
            }
        )
    })
    
    .delete(function(req, res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if(err)
                res.send(err);
            else
                res.send("succes delete");
        })
    })



app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});
