var express = require('express'); //import do mÃƒÂ³dulo
var app = express(); //Cria uma instancia do express
var bodyParser = require('body-parser');
app.listen(5000); //App irÃƒÂ¡ responder na porta 5000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');    
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res) {
	res.end('Servidor ON POHA!');
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("conectado");
});

//Esquema
var policiaSchema = new mongoose.Schema({
  name: String,
  senha: String,
});
var Policia = mongoose.model('Policia', policiaSchema);

var ocoSchema = new mongoose.Schema({
  tipo: String,
  nome: String,
  local: String,
  data: String,
  nomePol: String,
  nVitimas: String,
  isValidada: Boolean,
  descricao: String
});
var Oco = mongoose.model('OCO', ocoSchema);

app.post('/cadastrarPolicia', function(req, res) {
  var pol = new Policia({
    name: req.body.nome,
    senha: req.body.senha,
  });

  pol.save(function(err, pol) {
    if (err) return  res.json({msg: 'error'});
    return res.json({msg: 'Policia cadastrado com sucesso'});
  });
});

app.get('/loginPolicia', function(req, res) {
  Policia.find({}, function(err, pols) {
    res.send(pols.reduce(function(polMap, item) {
      polMap[item.id] = item;
        return polMap;
    }, {}));
  });
});

app.post('/getPol', function(req, res) {
  Policia.find({}, function(err, pols) {
    res.send(pols.reduce(function(polMap, item) {

      if(req.body.nome == item.nome && req.body.senha == item.senha){
        return item;
      }
       
    }, {}));
  });
});

app.get('/loginPolicia2', function(req, res) {
  Policia.find({}, function(err, pols) {
    res.send(pols);
  });
});


app.post('/cadastrarOco', function(req, res) {
  var oco = new Oco({
    tipo: req.body.tipo,
    nome: req.body.nome,
    local: req.body.local,
    data: req.body.data,
    nomePol: req.body.nomePol,
    nVitimas: req.body.nVitimas,
    isValidada: req.body.isValidada,
    descricao: req.body.descricao 
  });

  oco.save(function(err, oco) {
    if (err) return  res.json({msg: 'Falha ao cadastrar ocorencia'});
    return res.json({msg: 'Ocorrencia cadastrada com sucesso'});
  });
});

app.get('/getAllOco', function(req, res) {
  Oco.find({}, function(err, ocos) {
    res.send(ocos);
  });
});

app.post('/updateValida', function(req, res) {
  Oco.update({ _id: req.body.id }, { $set: { isValidada: true }}, callback);
});

