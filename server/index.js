const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const url = "mongodb://127.0.0.1:27017/subhamkr";
mongoose.connect(url).then(() => {
  console.log("Connected to database");
}).catch((e) => {
  console.log("Error connecting to database: " + e);
  
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the Job schema and model
const jobSchema = new mongoose.Schema({
  name: String,
  job_role: String,
  job_type: String
});

const Job = mongoose.model('Job', jobSchema);

const candidateSchema = new mongoose.Schema({
  name:String,
  email:String,
  age:Number,
  password:String,
  Job_type:String,
  qualificationLevel:String,
  location:String
})

const Candidate= mongoose.model('Candidate', candidateSchema);

const employerSchema= new mongoose.Schema({
  company_name:String,
  email:String,
  password:String,
  company_type:String,
  description:String,
  phone:String,
  size:Number,
  logo_url:String,
})

const Employer= mongoose.model('Employer',employerSchema);




app.post('/example', (req, res) => {
  // Access the parsed data in req.body
  const formData = req.body;
  // Process the data as needed
  res.send('Received form data: ' + JSON.stringify(formData));
});
app.post('/candidate',(req,res)=>{
  const formData = req.body;
  const candadate=new Candidate({
    name:formData.name,
    email:formData.email,
    age:formData.age,
    password:formData.password,
    Job_type:formData.job_type,
    qualificationLevel:formData.qualification,
    location:formData.location
  })
  candadate.save().then(()=>{
    console.log("candidate saved successfully");
  }).catch((err)=>{
    console.log("error saving candidate"+ err);
  })

  
})
app.post('/employer',(req,res)=>{
  const formData= req.body;
  const employer=new Employer({
    name:formData.name,
    email:formData.email,
    password:formData.password,
    company_name:formData.company_name,
    discription:formData.discription,
    size:formData.size,
    logo_url:formData.logo_url,
    phone:formData.phone,
  })
  employer.save().then(()=>{
    console.log("employer saved successfully");
  }).catch((err)=>{
    console.log("error saving employee", err);
  })
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user in the database
  const user = await Candidate.findOne({ email });

  if (!user) {
    // User not found
    return res.status(404).json({ message: 'User not found' });
  }

  // Check the password
  if (user.password !== password) {
    // Password is incorrect
    return res.status(401).json({ message: 'Incorrect password' });
  }

  // User is authenticated
  return res.status(200).json({ message: 'Login successful', user });
});

app.post('/post/job', (req, res) => {
  // Create and save a job instance
  const formData =req.body;
  console.log(formData);
  const job = new Job({
    name: formData.name,
    job_role: formData.job_role,
    job_type: formData.job_type
  });

  job.save().then(() => {
    console.log("Job saved");
    res.send('Received form data: ' + JSON.stringify(req.body));
  }).catch((error) => {
    console.error("Error saving job:", error);
    res.status(500).send("Error saving job");
  });
});

app.get('/', (req, res) => {
  Job.find().then((jobs)=>{
    res.send(jobs);
  }).catch((error)=>{
    console.log(error);
  })
})

// Start the Express server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
