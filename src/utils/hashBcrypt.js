const bcrypt = require("bcrypt");

//Con la funcion createHash vamos a aplicar el hash al password
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Con la funcion isValidPassword vamos a comparar el password
const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

module.exports = {
    createHash,
    isValidPassword
}