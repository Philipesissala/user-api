import knex from "../database/connection";
import User from "./User";
class passwordToken {
  async create(email) {
    var user = await User.findByEmail(email);
    if (user != undefined) {
      try {
        const token = Date.now();
        await knex
          .insert({ token, user_id: user[0].id, used: 0 })
          .table("passwordTokens");
        return { status: true, token };
      } catch (error) {
        return {
          status: false,
          error,
        };
      }
    } else {
      return {
        status: false,
        error: "O email passado não existe no banco de dados!",
      };
    }
  }

  async validate(token) {
    try {
      const result = await knex
        .select()
        .where({ token })
        .table("passwordTokens");
      if (result.length > 0) {
        const tk = result[0];
        if (tk.used) {
          return { status: false };
        } else {
          return { status: true, token: tk };
        }
      } else {
        return { status: false };
      }
    } catch (error) {}
  }
  async setUsed(token) {
    await knex.update({ used: 1 }).where({ token }).table("passwordTokens");
  }
}

export default new passwordToken();
