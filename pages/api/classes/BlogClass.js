import ConnectionDb from "./ConnectionDbClass";
import SubjectModel from "../../../models/subjectModel";

class SubjectBlog extends ConnectionDb {
  constructor() {
    super();
    this.model = SubjectModel;
    this.data = {};
    this.response = {
      ok: false,
      message: "",
      data: {},
    };
  }
  loadInitialSubjects = async () => {
    try {
      await this.connectToDb();
      const count = await this.model.count({});
      const workers = [][("math", "spanish", "history", "geography")].map(
        (subject) => {
          workers.push((resolve, reject) => {
            return resolve(this.model.create({ subjectName: subject }));
          });
        }
      );
      if (count === 0)
        await Promise.all(workers.map((promiseFn) => new Promise(promiseFn)));
      return true;
    } catch (error) {
      return false;
    }
  };
  getAllData = async (subject) => {
    try {
      this.data = await this.model.find();
      return this.data;
    } catch (error) {
      return [];
    }
  };
}

export default SubjectBlog;
