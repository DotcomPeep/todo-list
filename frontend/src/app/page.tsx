'use client'

// React default imports
import { useState, useEffect } from 'react'

// Forms
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Adapters
import { createTask, getTasks } from '@/adapters/task'

// Types
import { TaskDTO } from '@/types/TaskDTO'

const formDataSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
})

type FormDataProps = z.infer<typeof formDataSchema>

export default function Home() {
  const [tasks, setTasks] = useState<TaskDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const { handleSubmit, register } = useForm<FormDataProps>({
    resolver: zodResolver(formDataSchema),
  })

  async function handleCreateTask(dataForm: FormDataProps) {
    const data = await createTask(dataForm.title, dataForm.description)
    setTasks(data)
  }

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        setIsLoading(true)
        const data = await getTasks()
        setTasks(data)
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    }
    getAllTasks()
  }, [tasks])

  return (
    <div className="flex justify-center">
      <h1>Todo List</h1>

      <button onClick={() => setIsVisible(true)}>
        Clique aqui para criar sua tarefa
      </button>

      {isVisible && (
        <div className="flex justify-between">
          <div className="gap-x-2">
            <input
              placeholder="Digite o título da sua tarefa"
              {...register('title')}
            />

            <input
              placeholder="Digite a descrição da sua tarefa"
              {...register('description')}
            />
          </div>

          <button onClick={() => setIsVisible(false)}>Cancelar</button>
          <button onClick={handleSubmit(handleCreateTask)}>Criar</button>
        </div>
      )}

      {!isLoading && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              return (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {isLoading && <div>Carregando...</div>}
    </div>
  )
}
