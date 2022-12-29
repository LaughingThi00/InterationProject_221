const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const inspectorRouter = require('./routes/inspector')
const teacherRouter = require('./routes/teacher')
const studentRouter = require('./routes/student')
const classRouter = require('./routes/class')
const roomRouter = require('./routes/room')
const scheduleRouter = require('./routes/schedule')
const attendanceRouter = require('./routes/attendance')
const path = require('path')

require('dotenv').config()

const connectDB = async () => {
	try {
		await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_USERNAME}@${process.env.CLUSTER}.hnrd99b.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,	
		{
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		}
	)

		console.log('MongoDB connected')
	} catch (error) {
		console.log(error.message)
		process.exit(1)
	}
}

connectDB()

const app = express()
app.use(express.json())
app.use(cors())
app.get('/*',(req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/inspector', inspectorRouter)
app.use('/api/teacher', teacherRouter)
app.use('/api/student', studentRouter)
app.use('/api/class',classRouter)
app.use('/api/room',roomRouter)
app.use('/api/schedule',scheduleRouter)
app.use('/api/attendance',attendanceRouter)


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
