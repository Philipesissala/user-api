import knex from "../database/connection";
import bcrypt from "bcryptjs";
import PasswordToken from "./PasswordToken";
class User {
  async findAll() {
    try {
      return await knex.select(["id", "name", "email", "role"]).table("users");
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async findById(id) {
    try {
      const result = await knex
        .select(["id", "name", "email", "role"])
        .table("users")
        .where({ id });
      if (result.length > 0) {
        return result;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  async findByEmail(email) {
    try {
      const result = await knex
        .select(["id", "name", "email", "password", "role"])
        .table("users")
        .where({ email });
      if (result.length > 0) {
        return result;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  async save(name, email, password) {
    try {
      const hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ name, email, password: hash, role: 0 })
        .table("users");
    } catch (error) {
      console.log("Error" + error);
    }
  }

  async findEmail(email) {
    try {
      let result = await knex.select("*").from("users").where({ email });
      return result.length > 0 ? true : false;
    } catch (error) {
      return error;
    }
  }

  async edit(id, name, email, role) {
    const user = await this.findById(id);
    if (user != undefined) {
      var editUser = {};
      if (email != undefined) {
        if (email != user.email) {
          var result = await this.findEmail(email);
          if (!result) {
            editUser.email = email;
          } else {
            return { status: false, error: "O email já está cadastrado" };
          }
        }
      }
      if (name != undefined) {
        editUser.name = name;
      }
      if ((role = undefined)) {
        editUser.role = role;
      }
    } else {
      return { status: false, error: "O usuário não existe" };
    }
    try {
      await knex.update(editUser).where({ id }).table("users");
      return true;
    } catch (error) {
      return { status: false, error };
    }
  }

  async destry(id) {
    const user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id }).table("users");
        return { status: true };
      } catch (error) {
        return { status: false, error: "O usuário não existe" };
      }
    } else {
      return { status: false, error: "O usuário não existe" };
    }
  }

  async changePassword(password, id, token) {
    const hash = await bcrypt.hash(password, 10);
    await knex.update({ password: hash }).where({ id }).table("users");
    await PasswordToken.setUsed(token);
  }
}

export default new User();
