'use client'

import { getTasks } from '@/adapters/task'
import { mockTasks } from '@/mocks/mockTask'
import { TaskDTO } from '@/types/TaskDTO'
import { useState, useEffect } from 'react'

export default function Home() {
  const [tasks, setTasks] = useState<TaskDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getAllTasks = async () => {
      try {
        setIsLoading(true)
        const data = await getTasks()
        setTasks(data)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }
    getAllTasks()
  }, [])

  return (
    <div>
      {isLoading && <div>Carregando...</div>}
      {!isLoading && (
        <div>
          {tasks.map((task) => {
            return (
              <div key={task.id}>
                <h3>{task.title}</h3>
                <h4>{task.description}</h4>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
