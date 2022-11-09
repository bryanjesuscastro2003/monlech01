import { connection } from "../../../db/connection";

class ConnectionDb {
  constructor() {
    this.connection = connection;
    this.ok = false;
    this.intervalConnections = null;
    this.tryConnection = 0;
    this.limitTryConnections = 5;
  }
  connectionWithRetry = async () => {
    try {
      await this.connection();
      return true;
    } catch (error) {
      return false;
    }
  };
  connectToDb = async () => {
    try {
      if (!this.ok)
        this.intervalConnections = setInterval(async () => {
          this.ok = await this.connectionWithRetry();
          if (this.ok) clearInterval(this.intervalConnections);
          else this.tryConnection += 1;
          if (this.tryConnection > this.limitTryConnections) {
            this.tryConnection = 0;
            throw new Error("AAATYT22"); // -> Limite_exceeded
          }
        }, 5000);
    } catch (error) {
      if (error.message === "AAATYT22") throw error;
      else this.connectToDb();
    }
  };
}

export default ConnectionDb