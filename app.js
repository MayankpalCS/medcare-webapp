express=require("express")
parser=require("body-parser")
mongoose=require("mongoose")
ejs=require("ejs")
app=express()
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use('/static',express.static('public'))
const todoscheme=mongoose.Schema({
	title:{type:String,required:true},
	headline:{type:String},
    para:{type:String}

})
const schem=mongoose.Schema({
	name:{type:String,required:true},
	email:{type:String,required:true},
    password:{type:Number,required:true}
})
const appoint=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    gender:{type:String,required:true},
    age:{type:Number,required:true},
    disease:{type:String}
})
const re=mongoose.Schema({
    name:{type:String},
    relplies:{type:String}
})
const singin=mongoose.model('users',schem)
const things=mongoose.model('things',todoscheme)
const appointment = mongoose.model('appoint',appoint)
const replies = mongoose.model('replies',re)
mongoose.connect('mongodb://localhost/med')
app.get("/", async function(req,res){
    let response=await things.find({})
    let title=response[0].title
    let headline=response[0].headline
    let para=response[0].para
    res.render('index',{title:title,headline:headline,para:para})
    
})
app.get('/singin', async function(req,res){
    res.render('singin')
})
app.get('emailalreadytaken',function(req,res){
    res.send("email already taken")
})
app.get('namealreadytaken',function(req,res){
    res.send("name already taken")
})
app.post('/singin',async function(req,res){
    name2=req.body.name
    email=req.body.email
    password=req.body.password

    const response=await singin.find({})
    console.log(response)
    const a=await singin.create({
        name:name2,
        email:email,
        password:password
    })
    res.redirect('/')
    
})
app.get('/login',async function(req,res){
    res.render('login')
})


app.post('/appointment',async function(req,res){
    name1=req.body.name
    email=req.body.email
    gender=req.body.gender
    age=req.body.age
    disease=req.body.disease
    let response= await appointment.create({
        name:name1,
        email:email,
        gender:gender,
        age:age,
        disease:disease
    })
    res.redirect('/login')

})
app.post('/replying',async function(req,res){
    let date=req.body.date
    let name=req.body.name
    let email=req.body.button
    console.log(email)



    const l=await appointment.deleteOne({
        name:name
    })

    console.log(date)
    const po=replies.create({
        name:name,
        relplies:date
    })

    res.redirect('/')

})
app.get('/admin',async function(req,res){
    let respop=await appointment.find({})
    res.render('admin',{respop:respop})
 
})
app.post('/login',async function(req,res){
    name2=req.body.name
    password=req.body.password
    const response = await singin.find({})
    const replie = await replies.find({})
    for(var i=0;i<response.length;i++){
        if(response[i].name==name2 && response[i].password==password){
            res.render('users',{name:name2,replies:replie})
        }
    }
    
})
app.listen(3000,function(){
    console.log("server started at port 3000")
})