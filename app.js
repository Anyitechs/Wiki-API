const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const port = process.env.PORT || 4000;

mongoose.connect("mongodb://localhost:27018/wikiDB", { useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
    .get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        }
        else {
            res.send(err);  
        }
    });
})
    .post((req, res) => {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if (!err) {
            res.send("Successfully added the article to the database!");
        }
        else {
            res.send(err);
        }
    });
})
    .delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Successfully deleted all articles!");
        }
        else {
            res.send(err);
        }
    });
});

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, domArticle) => {
            if (!err) {
                res.send(domArticle);
            }
            else {
                res.send(err);
            }
        });
    })

    .put((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if (!err) {
                    res.send("Successfully updated the article!");
                }
                else {
                    res.send(err);
                }
            }
        )
    })

    .patch((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if (!err){
                    res.send("Successfully patched the document!");
                }
                else {
                    res.send(err);
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if (!err) {
                    res.send("Successfully deleted the specific article");
                }
                else {
                    res.send(err);
                }
            }
        )
    });






app.listen(port, () => console.log(`Something is happening on port ${port}.`))
