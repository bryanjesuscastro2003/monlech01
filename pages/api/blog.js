import SubjectBlog from "./classes/BlogClass"

const subjectWorker = new SubjectBlog();

const blog = async (req, res) => {
  try {
    await subjectWorker.connectToDb()
    const response = await subjectWorker.getAllData()
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send("Test");
  }
};

export default blog;
