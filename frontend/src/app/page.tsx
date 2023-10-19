'use client'

// React default imports
import { useState, useEffect } from 'react'

// Forms
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Adapters
import { createTask, deleteTaskById, getTasks } from '@/adapters/task'

// Icons
import { Trash } from 'phosphor-react'

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

  async function getAllTasks() {
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

  async function handleCreateTask(dataForm: FormDataProps) {
    const data = await createTask(dataForm.title, dataForm.description)
    getAllTasks()
  }

  async function handleDeleteTask(id: number) {
    await deleteTaskById(id)
    getAllTasks()
  }

  useEffect(() => {
    getAllTasks()
  }, [])

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold mb-4">Todo List</h1>
  
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => setIsVisible(true)}
      >
        Clique aqui para criar sua tarefa
      </button>
  
      {isVisible && (
        <div className="flex justify-between mt-4">
          <div className="space-x-2">
            <input
              className="border rounded p-2"
              placeholder="Digite o título da sua tarefa"
              {...register('title')}
            />
  
            <input
              className="border rounded p-2"
              placeholder="Digite a descrição da sua tarefa"
              {...register('description')}
            />
          </div>
  
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => setIsVisible(false)}
          >
            Cancelar
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleSubmit(handleCreateTask)}
          >
            Criar
          </button>
        </div>
      )}
  
      {!isLoading && (
        <table className="w-full mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 bg-">ID</th>
              <th className="p-2">Título</th>
              <th className="p-2">Descrição</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              return (
                <tr key={task.id} className="border-b">
                  <td className="p-2">{task.id}</td>
                  <td className="p-2">{task.title}</td>
                  <td className="p-2">{task.description}</td>
                  <td className='p-2'>
                    <Trash onClick={() => handleDeleteTask(task.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
  
      {isLoading && (
        <div className="mt-4 text-gray-600">Carregando...</div>
      )}
    </div>
  );
  
}
