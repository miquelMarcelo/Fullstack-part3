const mongoose = require('mongoose')
const url = `mongodb+srv://miquel:${process.env.PASSWORD_DB}@cluster0.edsiak2.mongodb.net/agenda-app?retryWrites=true&w=majority`

mongoose.connect(url)
  .then((result) => {
    console.log('conexion con Mongo')
  })
  .catch(e => {
    console.log('conexion fallida', e)
  })

const agendaSchema = new mongoose.Schema({
  name: String,
  number: Number
})

agendaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Agenda', agendaSchema)
