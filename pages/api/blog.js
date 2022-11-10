import SubjectBlog from "./classes/BlogClass"

const subjectWorker = new SubjectBlog();

const blog = async (req, res) => {
  try {
    const { action, payload } = req.body;
    let response = null
    await subjectWorker.loadInitialSubjects()
    switch (action) {
      case "GETALL":
           response =await subjectWorker.getAllData(payload.subject || null)
    }
    res.status(200).json(response)
  } catch (error) {
    console.log(error);
    res.send("Test");
  }
};

export default blog;
