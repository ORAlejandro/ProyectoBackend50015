const jwt = require("jsonwebtoken");

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;
    if(token) {
        jwt.verify(token, "coderhouse", (error, decoded) => {
            if(error) {
                res.status(401).send("Token invalido, acceso denegado");
            } else {
                const userRole = decoded.user.role;
                if(allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(401).send("Acceso denegado. Tu usuario no tiene permiso para acceder a este sitio");
                }
            }
        })
    } else {
        res.status(401).send("Token inexistente. Acceso denegado");
    }
};

module.exports = checkUserRole;