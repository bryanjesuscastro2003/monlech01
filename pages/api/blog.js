import SubjectBlog from "./classes/BlogClass";

const subjectWorker = new SubjectBlog();

const blog = async (req, res) => {
  try {
    const { action, payload } = {
      ...{ action: req.query.action, payload: { subject: req.query.payload, question: req.query.question} },
      ...req.body,
    };
    let response = null;
    await subjectWorker.loadInitialSubjects();
    switch (action.toUpperCase()) {
      case "GETALLSUBJECT":
        response = await subjectWorker.getAllData(payload.subject || null);
        break;
      case "GETSUBJECTQUESTION":
        response = await subjectWorker.getSubjectQuestion(payload);
        break;
      case "POSTNEWQUESTION":
        response = await subjectWorker.postNewQuestion(payload);
        break;
      case "POSTNEWRESPONSE":
        response = await subjectWorker.postNewResponse(payload);
        break;
    }
    res.status(200).json(response);
  } catch (error) {
    res
      .status(400)
      .json({
        ok: false,
        message: `Unexpected error try again later `,
        data: [],
      });
  }
};

export default blog;
