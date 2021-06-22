const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3000
const fileUpload = require('express-fileupload')
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
  file.mv('./videos/test.mp4').then(() => {
    hbjs
      .spawn({ input: './videos/test.mp4', output: './videos/converted.mp4' })
      .on('error', (err) => {
        console.log('download error',err)
      })
      .on('progress', (progress) => {
        console.log(
          'Percent complete: %s, ETA: %s',
          progress.percentComplete,
          progress.eta
        )
      })
      .on('complete', () => {
        res.json({ status: true })
      })
      .on('error', (err) => {
        console.log(err)
        res.json({ status: false })
      })
  })
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
