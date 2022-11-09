import Authorization from "./classes/AuthClass"

/**
 *    Class Intance
 */
const authWorker = new Authorization();
const auth = async (req, res) => {
  try {
    const { action, payload } = req.body;
    let response = null;
    switch (action.toUpperCase()) {
      case "SIGNIN":
        response = await authWorker.signin(payload, res);
        break;
      case "SIGNUP":
        response = await authWorker.signup(payload, res);
        break;
      case "JWT":
        response = await authWorker.validateJWT(payload);
        break;
      default:
        throw new Error("Such action not allowed");
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export default auth;
