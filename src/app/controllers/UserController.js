import User from "../services/User";
import PasswordToken from "../services/PasswordToken";
import jwt from "jsonwebtoken";
const secret =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
import bcrypt from "bcryptjs";
class UserController {
  async index(req, res) {
    res.json(await User.findAll());
  }
  async show(req, res) {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user != undefined) {
      return res.json(user);
    } else {
      res.status(404);
      return res.json({ message: "User not found!" });
    }
  }
  async store(req, res) {
    const { name, email, password } = req.body;
    if (name == undefined || email == undefined || password == undefined) {
      res.status(400);
      res.json({ erro: "Preencha todos os campos corretamente " });
      return;
    }

    const emailExists = await User.findEmail(email);
    if (emailExists) {
      res.status(406);
      res.json({ error: "O email já existe!" });
      return null;
    }
    await User.save(name, email, password);
    res.status(200);
    res.json({ message: "Sucesso!" });
  }
  async update(req, res) {
    const { name, email, role } = req.body;
    const { id } = req.params;

    const result = User.edit(id, name, email, role);
    if (result != undefined) {
      if (!result.status) {
        res.status(200);
        res.json({ message: "Sucess" });
      } else {
        res.status(406);
        res.json({ message: result.error });
      }
    } else {
      res.status(406);
      res.json("Ocorreu um erro");
    }
  }
  async delete(req, res) {
    const { id } = req.params;
    const result = await User.destry(id);
    if (result.status) {
      res.status(200).json({ message: "Eliminado com sucesso" });
    } else {
      res.status(406).json({ message: result.error });
    }
  }

  async recoverPassword(req, res) {
    const { email } = req.body;
    const result = await PasswordToken.create(email);
    if (result.status) {
      res.status(200).json(result.token);
    } else {
      res.status(406).json(result.error);
    }
  }

  async changePassword(req, res) {
    const { token, password } = req.body;

    const isTokenValid = await PasswordToken.validate(token);
    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200).json({ message: "Senha alterada com sucesso!" });
    } else {
      res.status(406).json({ message: "Token inválido!" });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (user != undefined) {
      const result = await bcrypt.compare(password, user[0].password);
      if (result) {
        const token = jwt.sign(
          { email: user[0].email, role: user[0].role },
          secret
        );
        res.status(200).json({ token });
      }
    } else {
      res.status(406).json({ message: "O usuário não existe" });
    }
  }
}

export default new UserController();
