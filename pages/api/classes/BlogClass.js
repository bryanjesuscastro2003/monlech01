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
      const workers = [];
      ["math", "spanish", "history", "geography"].map((subject) => {
        workers.push((resolve, reject) => {
          return resolve(this.model.create({ subjectName: subject }));
        });
      });
      let response = null;
      if (count === 0)
        response = await Promise.all(
          workers.map((promiseFn) => new Promise(promiseFn))
        );
      return true;
    } catch (error) {
      return false;
    }
  };
  getAllData = async (subject = null) => {
    try {
      this.data = Boolean(subject)
        ? await this.model.findOne({ subjectName: subject.toLowerCase() })
        : await this.model.find();
      this.response = {
        ok: true,
        message: "Subject monn data successfully",
        data: {
          subject: Boolean(subject) ? subject : "all",
          information: this.data,
        },
      };
      return this.response;
    } catch (error) {
      this.response = {
        ok: false,
        message: "Subject monn data unexpected error",
        data: { subject: "all", information: [] },
      };
      return this.response;
    }
  };
  /**
   *
   * @param {action} "new question , new response"
   * @param {payload} {subjectName : "" , type : "question", mainData : "your information", author : your id }
   */
  postNewData = async ({ action, payload }) => {
    try {
      const data = {
        question: payload.question,
        author: payload.author,
        responses: [],
      };
      let subject = await this.model.findOne({ subjectName: payload.subject });
      if (!Boolean(subject)) throw new Error("Such subject is not available");
      await subject.questions.push(data);
      this.response = {
        ok: true,
        message: "Your question was successfully added",
        data: [],
      };
      return this.response;
    } catch (error) {
      this.response = {
        ok: false,
        message: this.error.message,
        data: [],
      };
      return this.response;
    }
  };
}

export default SubjectBlog;
