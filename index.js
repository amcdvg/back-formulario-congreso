// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexión con MongoDB
mongoose.connect('mongodb+srv://alexmorenoc3:cfpTQGHFH91rhPdH@cluster0.ho5zg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/*const RespuestaSchema = new mongoose.Schema({
  questionIndex: Number,
  response: String,
});*/
const RespuestaSchema = new mongoose.Schema({
    empresa: String, // Nuevo campo para almacenar el nombre de la empresa
    questionIndex: Number,
    question: String, // Guardar la pregunta también puede ser útil
    response: String,
  });
  

const Respuesta = mongoose.model('Respuesta', RespuestaSchema);

// Ruta para agregar una respuesta
/*app.post('/respuesta', async (req, res) => {
  const { questionIndex, response } = req.body;

  const nuevaRespuesta = new Respuesta({ questionIndex, response });
  await nuevaRespuesta.save();

  res.status(201).send({ message: 'Respuesta guardada' });
});*/
app.post('/respuesta', async (req, res) => {
    const { empresa, questionIndex, question, response } = req.body;
  
    // Validar los datos recibidos
    if (!empresa || questionIndex === undefined || !question || !response) {
      return res.status(400).send({ message: 'Todos los campos son obligatorios' });
    }
  
    const nuevaRespuesta = new Respuesta({ empresa, questionIndex, question, response });
    await nuevaRespuesta.save();
  
    res.status(201).send({ message: 'Respuesta guardada correctamente' });
  });

// Ruta para obtener respuestas agrupadas por pregunta
app.get('/respuestas', async (req, res) => {
  const respuestas = await Respuesta.aggregate([
    { $group: { _id: '$questionIndex', respuestas: { $push: '$response' } } },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).send(respuestas);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
