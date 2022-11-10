import SubjectBlog from "./classes/BlogClass"

const subjectWorker = new SubjectBlog();

const blog = async (req, res) => {
  try {
    const { action, payload } = {...{action : req.query.action, payload : {subject : req.query.payload}}, ...req.body};
    let response = null
    await subjectWorker.loadInitialSubjects()
    switch (action) {
      case "GETALLSUBJECT":
           response =await subjectWorker.getAllData(payload.subject || null)
    }
    res.status(200).json(response)
  } catch (error) {
    res.send("Test");
  }
};

export default blog;
