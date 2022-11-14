import ConnectionDb from "./ConnectionDbClass";
import SubjectModel from "../../../models/subjectModel";

class SubjectBlog extends ConnectionDb {
  constructor() {
    super();
    this.model = SubjectModel;
    this.data = {};
    this.subjectQuestion = {};
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
      return subject;
    } catch (error) {
      throw error;
    }
  };
  getSubjectQuestion = async (payload) => {
    try {
      const subject = await this.findSubject(payload.subject);
      let index = 0,
        question = null;
      while (index < subject.questions.length) {
        if (subject.questions[index]._id.toString() === payload.question) {
          question = subject.questions[index];
          break;
        }
        index += 1;
      }
      if (!Boolean(question)) throw new Error("Such question is not available");
      return (this.response = {
        ok: true,
        message: "Subject questions loaded successfully",
        data: question,
      });
    } catch (error) {
      return (this.response = {
        ok: false,
        message: error.message,
        data: { responses: [] },
      });
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
      let subject = await this.findSubject(payload.subject.toLowerCase());
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

  updateQuestion = async (payload) => {
    try {
      const { subject, questionID, value } = payload;
      const partialResponse = await this.model.findOne({
        subjectName: subject.toLowerCase(),
      });
      let myQuestion = null,
        index = 0;
      while (index < partialResponse.questions.length) {
        if (partialResponse.questions[index]._id.toString() === questionID) {
          myQuestion = {
            ...partialResponse.questions[index]._doc,
            question: value,
          };
          break;
        }
        index++;
      }
      const questionListUpdated = partialResponse.questions.filter(
        (question) => question._id.toString() !== questionID
      );
      partialResponse.questions = questionListUpdated;
      partialResponse.questions.push(myQuestion);
      await partialResponse.save();
      return (this.response = {
        ok: true,
        message: "Your questions has been updated",
        data: null,
      });
    } catch (error) {
      return (this.response = {
        ok: false,
        message: "Unexpected error try again later",
        data: null,
      });
    }
  };

  deleteQuestion = async (payload) => {
    try {
      const { subject } = payload;
      const partialResponse = await this.model.findOne({
        subjectName: subject.toLowerCase(),
      });
      const questionListUpdated = partialResponse.questions.filter(
        (question) => question._id.toString() !== payload.question
      );
      partialResponse.questions = questionListUpdated;
      await partialResponse.save();
      return (this.response = {
        ok: true,
        message: "Your question has been removed",
        data: null,
      });
    } catch (error) {
      return (this.response = {
        ok: false,
        message: "Unexpected error try again later",
        data: null,
      });
    }
  };

  updateQuestionResponse = async (payload) => {
    try {
      const { subject, question, response, value } = payload;
      const partialResponse = await this.model.findOne({
        subjectName: subject.toLowerCase(),
      });
      if(!Boolean(partialResponse)) throw new Error("Such question is not available")
      let partialQuestion = null,
        index = 0;
      while (index < partialResponse.questions.length) {
        if (partialResponse.questions[index]._id.toString() === question) {
          partialQuestion = partialResponse.questions[index];
          index = 0;
          break;
        }
        index++;
      }
      if (!Boolean(partialQuestion))
        throw new Error("Such question is not available");
      let partialQuestionResponse = null;
      while (index < partialQuestion.responses.length) {
        if (partialQuestion.responses[index]._id.toString() === response) {
          partialQuestionResponse = {
            ...partialQuestion.responses[index]._doc,
            response: value,
          };
          index = 0;
          break;
        }
        index++;
      }
      if(!Boolean(partialQuestionResponse)) throw new Error("Such response is not available")
      const responseListUpdated = partialQuestion.responses.filter(
        (res) => res._id.toString() !== response
      );
      partialQuestion.responses = responseListUpdated;
      partialQuestion.responses.push(partialQuestionResponse);

      let questionListUpdated = partialResponse.questions.filter(
        (que) => {
          return que._id.toString() !== question}
      );
      questionListUpdated.push(partialQuestion);
      partialResponse.questions = questionListUpdated;
      await partialResponse.save();
      return (this.response = {
        ok: true,
        message: "Your response  has been updated",
        data: null,
      });
    } catch (error) {
      return (this.response = {
        ok: false,
        message: "Unexpected error updating response",
        data: null,
      });
    }
  };

  deleteQuestionResponse = async (payload) => {
    try {
      const { subject, question, response } = payload;
      const partialResponse = await this.model.findOne({
        subjectName: subject.toLowerCase(),
      });
      if(!Boolean(partialResponse))throw new Error("Such question is not available")
      let partialQuestion = null,
        index = 0;
      while (index < partialResponse.questions.length) {
        if (partialResponse.questions[index]._id.toString() === question) {
          partialQuestion = partialResponse.questions[index];
          break;
        }
        index++;
      }
      if (!Boolean(partialQuestion))
        throw new Error("Such question is not available");
      const responseListUpdated = partialQuestion.responses.filter(
        (res) => res._id.toString() !== response
      );
      partialQuestion.responses = responseListUpdated;
      let questionListUpdated = partialResponse.questions.filter(
        (que) => que._id.toString() !== question
      );
      questionListUpdated.push(partialQuestion);
      partialResponse.questions = questionListUpdated;
      await partialResponse.save();
      return (this.response = {
        ok: true,
        message: "Your response  has been removed",
        data: null,
      });
    } catch (error) {
      return (this.response = {
        ok: false,
        message: "Unexpected error deleting response",
        data: null,
      });
    }
  };
}

export default SubjectBlog;
