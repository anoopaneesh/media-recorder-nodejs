const express = require('express')
const app = express()
const getDB = require('./connection.js')
const path = require('path')
const cors = require('cors')
const {nanoid}  = require('nanoid')
const PORT = process.env.PORT || 3000
const fileUpload = require('express-fileupload')
getDB().connect(function (err) {
  if (err) console.log(err)
  console.log('Connected!')
})
const sql ='CREATE TABLE videos (name varchar(255),video_id varchar(255) primary key);'
app.use(cors({ origin: '*' }))
app.use(express.static(path.join(__dirname, './videos')))
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'))
})

app.post('/convertTomp4', async (req, res) => {
  const hbjs = require('handbrake-js')
  console.log('Reached here at uploading')
  let file = req.files.file
  if (!file) {
    console.log('file not uploaded')
  }
  file.mv(`${__dirname}/videos/test.mp4`).then((err) => {
    if (err) console.log(err, 'from fileuplaod')
    const videoID = nanoid()
    const userID = nanoid()
    const quesID = nanoid()
    hbjs
      .spawn({
        input: `${__dirname}/videos/test.mp4`,
        output: `${__dirname}/videos/${videoID}.mp4`,
      })
      .on('error', (err) => {
        console.log('download error', err)
      })
      .on('progress', (progress) => {
        console.log(
          'Percent complete: %s, ETA: %s',
          progress.percentComplete,
          progress.eta
        )
      })
      .on('complete', () => {
        getDB().query(`insert into videos values('user','${videoID}','${userID}','${quesID}');`, function (err, result) {
          if (err) throw err
          res.json({ status: true })
        })
      })
      .on('error', (err) => {
        console.log(err)
        res.json({ status: false })
      })
  })
})
app.get('/video',(req,res)=>{
  if(!req.query || !req.query.user_id || !req.query.ques_id){
    res.status(404)
    res.send({error:"invalid query"})
  }
  getDB().query(`select * from videos where user_id='${req.query.user_id}' and ques_id='${req.query.ques_id}';`, function (err, result) {
    if(err){
      console.log(err)
    }else{
    res.redirect(`/${result[0].video_id}.mp4`)
    }
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
