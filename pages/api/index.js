import {connection} from "../../db/connection"

const index = async (req, res) => {
     await connection()
     res.send("config")
}

export default index