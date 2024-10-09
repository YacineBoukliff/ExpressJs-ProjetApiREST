import mongoose from "mongoose";

mongoose.connect('mongodb://localhost/playgroundEmbedding')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

// const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors : [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) { 
  const course = await Course.findByIdAndUpdate({_id : courseId}, {
    $unset : {
      'author' : ''
    }
  });
}

// updateAuthor('6706a2a02e816775f8890eed')

createCourse('Node Course', [
  { name: "Yacine Jefe" },
  { name: "Norhane Hbiba" }
]);