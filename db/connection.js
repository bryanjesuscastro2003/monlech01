import {mongo_uri} from "../config/config"
import config from "../config/config"
import mongoose from "mongoose"

export const connection =  async () => {
      try {
            await mongoose.connect(config.mongo_uri)  
      } catch (error) {throw error}
}
