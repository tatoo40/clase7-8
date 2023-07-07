const fs = require("fs");
const bcrypt = require("bcrypt");
const { saveUsuarios, readUsuarios } = require("../services/usuariosServices");

const renderIndex = (req, res) => {
  res.render("index");
};
const renderLogin = (req, res) => {
  res.render("login", { errors: [] });
};
const renderRegistro = (req, res) => {
  res.render("register", { errors: [] });
};

const registrarNuevo = (req, res) => {
  const { email, password } = req.body;


  const usuarios = readUsuarios();

  const resultado = usuarios.some((user) => user.email === email);

  if (resultado){
    return res.status(400).send("El usuario ya existe");
  }
  //validar si existe retrun

  // Generar un salt (valor aleatorio) para fortalecer el hashing
  // const saltRounds = 1; // $2b$04$qXQ9W1gqwBTXfvGuZsxG9edctiC1i17pp/U49BgF69jyyyEqvociS
  const saltRounds = 10; // $2b$10$UEhs00CicTlcIc3K3Zjf4uKqyvw4F/iSrbzfFntfIk/W5qDGPu.2O
  // Aplicar el hashing de la contraseña utilizando bcrypt
  bcrypt.hash(password, saltRounds, (error, hashedPassword) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al hashear la contraseña");
      return;
    }
    // Crear un objeto con el email y la contraseña hasheada
    const nuevoUsuario = {
      email,
      password: hashedPassword, // Guardar la contraseña hasheada en lugar de la original
    };

    const usuarios = readUsuarios();
    usuarios.push(nuevoUsuario);
    saveUsuarios(usuarios);
    //console.log(nuevoUsuario)
    req.session.usuario = nuevoUsuario;

    res.redirect("/admin/perfil");

  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const usuarios = fs.readFileSync("usuarios.json", "utf-8");
  const usuariosParsed = JSON.parse(usuarios);
  // console.log({ email, password });
  let resultado;

  if (Array.isArray(usuariosParsed)) {
  
    resultado = usuariosParsed.filter((user) => user.email === email);
    // Realiza las operaciones adicionales con el resultado filtrado
  } else {
    // Manejar el caso en el que usuarios no sea un arreglo válido
    //console.log(error)
    return res.send("Credenciales invalidas")
  } 

  // si lo encuento uso el bcript compare
  if (resultado) {
    bcrypt.compare(password, resultado.password, (error, result) => {
      if (error) {
        console.log(error);
        return res.status(400).send("Error al comparar la contraseña");
      }

      // result solo va a ser TRUE o FALSE
      if (result) {
        console.log("contraseña correcta");
        return res.status(200).send("Logeado correctamente");
      } else {
        console.log("contraseña incorrecta");
        return res.status(500).send("Contraseña incorrecta");
      }
    });
  } else {
    console.log("contraseña correcta");
    return res.status(200).send("Logeado correctamente");
  }
};

module.exports = {
  renderIndex,
  renderLogin,
  renderRegistro,
  registrarNuevo,
  login,
};
