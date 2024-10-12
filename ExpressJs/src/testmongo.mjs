import mongoose from "mongoose"

mongoose.connect('mongodb://localhost/Yacine')
.then(() => {console.log('La connexion a MongoDB est effectué')})
.catch(() => {console.log('La connexion a MongoDB a échoué')})

const testSchema = new mongoose.Schema({
    nom : {
        type : String,
        required : true
    },
    age : Number,
    adresse : {
        type : String,
        required : true
    },
})

const Test = mongoose.model('utilisateurs',testSchema)
async function Database(){
    const test = new Test ({
        nom : 'yacine',
        age : 25,
        adresse : " 17 rue victor hugo"
    })
  const testconsole =  await test.save()

  console.log(testconsole)
}

Database()

console.log("Changement")