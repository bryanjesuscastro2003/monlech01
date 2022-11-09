import UserModel from "../../../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ConnectionDb from "./ConnectionDbClass";

class Authorization extends ConnectionDb {
  constructor() {
    super();
    this.saltRounds = 10;
    this.jwtprivatekey = process.env.jwtSecretKey;
    this.jwtexpiresIn = process.env.jwtexpireIn;
    this.jasonwebtoken = null;
    this.jsonwebtokenInformation = {};
    this.messageError = "";
    this.response = {
      ok: false,
      message: "",
      data: {},
    };
  }

  encryptPassword = async (password) => {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw error;
    }
  };
  decryptPassword = async (password, passwordEncrypted) => {
    try {
      return await bcrypt.compare(password, passwordEncrypted);
    } catch (error) {
      throw error;
    }
  };

  generateJWT = async (data) => {
    try {
      this.jsonwebtoken = await jwt.sign({ data }, this.jwtprivatekey, {
        expiresIn: this.jwtexpiresIn,
      });
    } catch (error) {
      throw error;
    }
  };

  signin = async (data, res) => {
    try {
      await this.connectToDb();
      const { username, password } = data;
      const user = await UserModel.findOne({ username });
      if (!Boolean(user)) throw new Error("Such user does not exist");
      const okPassword = await this.decryptPassword(password, user.password);
      if (!okPassword) throw new Error("Such password is incorrect");
      await this.generateJWT(user);
      this.response = {
        loggedIn: true,
        ok: true,
        message: "Logged in successfully",
        data: user,
        jwt: this.jsonwebtoken,
      };
      return this.response;
    } catch (error) {
      this.messageError = "";
      if (!this.ok)
        this.messageError = "Unexpected error please try again later";
      else this.messageError = error.message;
      return (this.response = {
        loggedIn: false,
        ok: false,
        message: this.messageError,
        data: {},
      });
    }
  };

  signup = async (data, res) => {
    try {
      await this.connectToDb();
      const { password } = data;
      const passwordEncrypted = await this.encryptPassword(password);
      const body = { ...data, password: passwordEncrypted };
      const user = await UserModel(body).save();
      await this.generateJWT(user);
      this.response = {
        loggedIn: true,
        ok: true,
        message: "Logged up successfully",
        data: user,
        jwt: this.jsonwebtoken,
      };
      return this.response;
    } catch (error) {
      this.messageError = "";
      if (!this.ok)
        this.messageError = "Unexpected error please try again later";
      else if (error.code === 11000)
        this.messageError = `Value error : ${JSON.stringify(
          error.keyValue
        )} is already registered, please enter another one .`;
      return (this.response = {
        loggedIn: false,
        ok: false,
        message: this.messageError,
        data: {},
      });
    }
  };

  validateJWT = async ({ token }) => {
    try {
      this.jsonwebtokenInformation = await jwt.verify(
        token,
        this.jwtprivatekey
      );
      this.response = {
        loggedIn: true,
        ok: true,
        message: "Logged in successfully",
        data: this.jsonwebtokenInformation.data,
        jwt: token,
      };
      return this.response;
    } catch (error) {
      return (this.response = {
        loggedIn: false,
        ok: false,
        message: error.message,
        data: {},
      });
    }
  };
}

export default Authorization;
