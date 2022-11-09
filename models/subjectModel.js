import mongoose from 'mongoose'

const SubjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
        maxLength: 60
    },
    questions : {
          type : String,
          responses : [
            {
               author : {
                type : String,
                required: true,
               },
               response : {
                type : String,
                required: true,
               }
            }                 
          ]
    }
}, {
    timestamps: true
})

export default  mongoose.models.SubjectMonn || mongoose.model("SubjectMonn", SubjectSchema)