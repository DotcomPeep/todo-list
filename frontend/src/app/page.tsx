'use client'

// React default imports
import { useState, useEffect } from 'react'

// Forms
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Adapters
import {
  createTask,
  deleteTaskById,
  getTasks,
  updateTaskById,
} from '@/adapters/task'

// Icons
import { Pencil, Trash } from 'phosphor-react'

// Types
import { TaskDTO } from '@/types/TaskDTO'

// Mocks
import { mockTasks } from '@/mocks/mockTask'

const formDataSchema = z.object({
  title: z.string().min(3, 'O título deve ter no miníno 3 caracteres!'),
  description: z.string(),
})

type FormDataProps = z.infer<typeof formDataSchema>

export default function Home() {
  const [tasks, setTasks] = useState<TaskDTO[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<null | number>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isCreating, setIsCreating] = useState<boolean>(false)

  const { handleSubmit, register, reset, formState:{ errors } } = useForm<FormDataProps>({
    resolver: zodResolver(formDataSchema),
  })

  async function handleCreateTask(data: FormDataProps) {
    try {
      await createTask(data.title, data.description)
      await getAllTasks()
      setIsCreating(false)
      reset()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

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

  async function handleEditTask(data: FormDataProps) {
    try {
      if (selectedTaskId) {
        await updateTaskById(selectedTaskId, data.title, data.description)
        await getAllTasks()
        setIsEditing(false)
        reset()
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      await deleteTaskById(id)
      await getAllTasks()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  function handleOpenInputs(id: number) {
    if (isCreating) {
      setIsCreating(false)
    }
    reset()
    setIsEditing(true)
    setSelectedTaskId(id)
  }

  useEffect(() => {
    getAllTasks()
  }, [])

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold mb-4">Todo List</h1>

      {!isCreating && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:disabled:bg-blue-900"
          onClick={() => setIsCreating(true)}
          disabled={isEditing}
        >
          Clique aqui para criar sua tarefa
        </button>
      )}

      {isCreating && (
        <div className="flex justify-between mt-4">
          <div className="space-x-2">
            <input
              className="border rounded p-2 text-gray-900"
              placeholder="Digite o título da sua tarefa"
              {...register('title')}
            />

            {errors?.title?.message &&
            (<span className='text-red-500'>{errors?.title?.message}</span>)}

            <input
              className="border rounded p-2 text-gray-900"
              placeholder="Digite a descrição da sua tarefa"
              {...register('description')}
            />
          </div>

          <div className="flex gap-x-2 ml-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                setIsCreating(false)
                reset()
              }}
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
        </div>
      )}

      {!isLoading && (
        <table className="w-full mt-6">
          <thead>
            <tr className="bg-gray-500">
              <th className="p-2 bg-" align="left">
                ID
              </th>
              <th className="p-2" align="left">
                Título
              </th>
              <th className="p-2" align="left">
                Descrição
              </th>
              <th className="p-2" align="left"></th>
              <th className="p-2" align="left"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              return (
                <tr key={task.id} className="border-b">
                  <td className="p-2" align="left">
                    {task.id}
                  </td>
                  <td className="p-2" align="left">
                    {task.title}
                  </td>
                  <td className="p-2 truncate" align="left">
                    {task.description}
                  </td>
                  <td className="p-2" align="left">
                    <Trash
                      className="text-red-500 hover:cursor-pointer"
                      onClick={() => handleDeleteTask(task.id)}
                      size={22}
                    />
                  </td>
                  <td className="p-2" align="left">
                    <Pencil
                      className="text-green-500 hover:cursor-pointer"
                      onClick={() => handleOpenInputs(task.id)}
                      size={22}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {isLoading && <div className="mt-4 text-gray-600">Carregando...</div>}

      {isEditing && (
        <div className="flex justify-between mt-4">
          <div className="space-x-2">
            <input
              className="border rounded p-2 text-gray-900"
              placeholder="Altere o título da sua tarefa"
              {...register('title')}
            />

            {errors?.title?.message &&
            (<span className='text-red-500'>{errors?.title?.message}</span>)}

            <input
              className="border rounded p-2 text-gray-900"
              placeholder="Altere a descrição da sua tarefa"
              {...register('description')}
            />
          </div>

          <div className="flex gap-x-2 ml-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                setIsEditing(false)
                setSelectedTaskId(null)
              }}
            >
              Cancelar
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleSubmit(handleEditTask)}
            >
              Editar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
