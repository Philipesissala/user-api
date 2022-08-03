import jwt from "jsonwebtoken";
export default (req, res, next) => {
  const secret =
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
  const authToken = req.headers["authorization"];
  if (authToken != undefined) {
    const bearer = authToken.split(" ");
    const token = bearer[1];
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded.role == 1) {
        next();
      } else {
        res
          .status(403)
          .json({ message: "Voce não tem permissão para acessar esta rota" });
        return null;
      }
    } catch (error) {
      res.status(406).json({ message: "Invalid token" });
    }
  } else {
    res
      .status(403)
      .json({ message: "Voce não tem autorização para acessar esta página" });
  }
};
