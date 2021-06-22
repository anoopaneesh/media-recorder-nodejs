const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const fileUpload = require('express-fileupload')
app.use(cors({origin:'*'}))
app.use(express.static(path.join(__dirname,'./videos')))
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
  let file = req.files.file
  await file.mv('./videos/test.mp4')
  const hbjs = require('handbrake-js')

  hbjs
    .spawn({ input: './videos/test.mp4', output: './videos/converted.mp4' })
    .on('error', (err) => {
      // invalid user input, no video found etc
    })
    .on('progress', (progress) => {
      console.log(
        'Percent complete: %s, ETA: %s',
        progress.percentComplete,
        progress.eta
      )
    })
    .on('complete', () => {
      res.json({status:true})
    })
    .on('error', () => {
      res.statusCode(400)
      res.json({ status: false })
    })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
