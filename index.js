const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)


app.use(express.json())


app.get('/tasks',async(req, res) => { 
  try {
    const taskld= await tasks.findAll()
    res.status(201).json(taskld)
  }catch(err){
      res.status(500).json({message:err.message})
    }
  })


app.post('/tasks', async (req, res) => {
  const { description, done} = req.body
  if(description == null || done == null){
    res.status(400).send("os valores São errados")
  }
  else{
    if(done == true || done == false){
  const newtask = await tasks.create({
    description,
    done
  })
  res.status(200).send('cadastro efetuado')
  }
    else{
      res.status(400).send("o valor colocado deve ser verdadeiro ou falso")
    }
}

})


app.get('/tasks/:id', async(req, res) => {


  const taskId = req.params.id

  const noTem = await tasks.findByPk(( taskId ))

  if(noTem == null) {

    return res.status(400).send ('INSERIR ID' )
  }

  try {

  res.status(200).json({ noTem })
} catch(err) {
  res.status(500).json({message: err.message})
}
});


app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
   const { description, done } = req.body
   const task = {
     description,
     done
   }
   try {
     await tasks.update(task, { where: { id: taskId } })

    res.status(201).send(
        'registro foi atualizado'
       )
   } catch (error) {
     res.status(500).json({ error: error + ".registro errado." })
   }
 })


app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  try {
    const taskToDelete = await tasks.destroy({ where: { id: taskId } })

    if (!taskToDelete) {
      res.status(422).json({ message: ' não existe!' })
      return
    }

    res.status(200).send({
      action: 'registro apagado',
      deletedTaskId: taskId
    })
  } catch (error) {
    res.status(500).json({ error: error + ". error ..." })
  }
})


app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
