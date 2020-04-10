var bodyparser=require("body-parser");
var express=require('express');
var mongoose=require('mongoose');
var methodoverride=require('method-override');
var app=express();
app.set("view engine","ejs")
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodoverride("_method"));

mongoose.connect('mongodb://localhost:27017/moviesapp',{useNewUrlParser:true})

var movieSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String
})

var movieblog=mongoose.model("movies", movieSchema);

app.get("/",function(req,res){
	res.redirect("/movies");
});

//INDEX ROUTE
app.get("/movies",function(req,res){
	movieblog.find({},function(err,movies){
		if(err){
			res.send("Error")
		}
		else{
			res.render('index',{movies:movies})
		}
	})
	
})

//New ROUTE
app.get("/movies/new",function(req,res){
	res.render("new")
})

//Create Route

app.post("/movies",function(req,res){
	var title=req.body.name;
	var image=req.body.image;
	var body=req.body.content;
	var newMovie={title:title,image:image,body:body};
	movieblog.create(newMovie, function(err,foundmovie){
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/movies");
		}
	})
})

//SHOW ROUTE
app.get("/movies/:id",function(req,res){
	movieblog.findById(req.params.id,function(err,foundmovie){
		if(err){
			res.redirect("/movies")
		}
		else{
			res.render("show",{movie:foundmovie})
		}
	})
	
})


//EDIT ROUTE
app.get("/movies/:id/edit",function(req,res){
	movieblog.findById(req.params.id,function(err,movies){
		if(err){
			res.redirect("/movies");
		}
		else{
			res.render("edit",{movie:movies});
		}
	})
		
	
})


//UPDATE ROUTE
app.put("/movies/:id",function(req,res){
	var title=req.body.name;
	var image=req.body.image;
	var body=req.body.content;
	var newMovie={title:title,image:image,body:body};
	movieblog.findByIdAndUpdate(req.params.id,newMovie,function(err,newmovie){
		if(err){
			res.redirect("/movies")
		}
		else{
			res.redirect("/movies/"+req.params.id)
		}
	})
})


//Delete Route
app.delete("/movies/:id",function(req,res){
	movieblog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/movies")
		}
		else{
			res.redirect("/movies")
		}
	})
})














app.get("*",function(req,res){
	res.send("Page Not Found")
})



app.listen(3000,function(){
	console.log("Server Started");
})