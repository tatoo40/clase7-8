const renderPerfil = (req, res) => {

  console.log(req.session.usuario);
  const usuario = req.session.usuario;
  res.render("perfil",{usuario});
  //
  //res.send("Perfil")
};

module.exports = {
  renderPerfil,
};
