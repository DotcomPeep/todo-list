// Services
import { api } from '@/services/api'

// Types
import { TaskDTO } from '@/types/TaskDTO'

export async function getTasks(): Promise<TaskDTO[]> {
  try {
    const { data } = await api.get('/')
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getTaskById(id: number): Promise<TaskDTO> {
  try {
    const { data } = await api.get(`/${id}`)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function createTask(title: string, description: string) {
  try {
    const { data } = await api.post('/', {
      title,
      description,
    })
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function updateTaskById(
  id: number,
  title: string,
  description: string,
) {
  try {
    const { data } = await api.put(`/${id}`, {
      title,
      description,
    })
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function deleteTaskById(id: number) {
  try {
    const { data } = await api.delete(`/${id}`)
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}
