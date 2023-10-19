import { api } from '@/services/api'

export async function getTasks() {
  try {
    const { data } = await api.get('/')
    return data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export async function getTaskById(id: number) {
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
