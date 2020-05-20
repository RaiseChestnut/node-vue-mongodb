module.exports = app => {
  const express = require('express')
  const router = express.Router({
    mergeParams: true
  })

  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  router.delete('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndDelete(req.params.id)
    res.send({
      success: true
    })
  })
  router.get('/', async (req, res) => {
    const queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(10)
    res.send(items)
  })
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  const middleware = (req, res, next) => {
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../../modules/${modelName}`)
    next()
  }

  app.use('/admin/api/rest/:resource', middleware, router)

  
  
  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
    
  app.post('/admin/api/upload', upload.single('file'), async function (req, res) {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })
}