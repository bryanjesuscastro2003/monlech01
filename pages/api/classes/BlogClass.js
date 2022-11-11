import ConnectionDb from "./ConnectionDbClass";
import SubjectModel from "../../../models/subjectModel";

class SubjectBlog extends ConnectionDb {
  constructor() {
    super();
    this.model = SubjectModel;
    this.data = {};
    this.subjectQuestion = {} 
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
  findSubject = async (subjectName) => {
       try {
           const subject = await this.model.findOne({
               subjectName: subjectName.toLowerCase(),
            });
            if (!Boolean(subject)) throw new Error("Such subject is not available");
            return subject
       } catch (error) {throw error}
  }
  getSubjectQuestion = async (payload) => {
      try {
            const subject = await this.findSubject(payload.subject)
            let index = 0,
            question = null;
          while (index < subject.questions.length) {
            if (subject.questions[index]._id.toString() === payload.question) {
              question = subject.questions[index];
              break;
            }
            index += 1;
          }
          return this.response = {
             ok : true, 
             message : "Subject questions loaded successfully",
             data : question
          }

      } catch (error) {
        return this.response = {
          ok: false,
          message: error.message,
          data: [],
        };
      }
  };
  /**
   *
   * @param {action} "new question , new response"
   * @param {payload} {subjectName : "" , type : "question", mainData : "your information", author : your id }
   */
  postNewQuestion = async (payload) => {
    try {
      const data = {
        question: payload.question,
        author: payload.author,
        responses: [],
      };
      let subject = await this.findSubject(payload.subject)
      subject.questions.push(data);
      await subject.save();
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
  postNewResponse = async (payload) => {
    try {
      const data = {
        author: payload.author,
        response: payload.response,
      };
      let subject = await this.model.findOne({
        subjectName: payload.subject.toLowerCase(),
      });
      if (!Boolean(subject)) throw new Error("Such subject is not available");
      let index = 0,
        question = null;
      while (index < subject.questions.length) {
        if (subject.questions[index]._id.toString() === payload._id) {
          subject.questions[index].responses.push(data);
          await subject.save();
          question = subject.questions[index];
          break;
        }
        index += 1;
      }
      return (this.response = {
        ok: true,
        message: "Your response has been saved successfully",
        data: question,
      });
    } catch (error) {
      return (this.response = {
        ok: false,
        message: "Unexpected error try again later",
        data: null,
      });
    }
  };
}

export default SubjectBlog;
