//import axios from 'axios/dist/axios.min.js'
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const get = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updateData => {
  const { id, newObject } = updateData
  console.log('UPDATE ROUTE newObject: ', newObject)
  try {
    const response = await axios.put(`${baseUrl}/${id}`, newObject)
    return response.data
  } catch (error) {
    console.log('Update failed:', error)
    throw error
  }
}

const destroy = async id => {
  const config = {
    headers: { Authorization: token },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const getComments = async id => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}

const postComment = async commentData => {
  const { id, comment } = commentData
  const response = await axios.post(`${baseUrl}/${id}/comments`, {
    content: comment,
  })
  return response.data
}

export default {
  setToken,
  getAll,
  get,
  create,
  update,
  destroy,
  getComments,
  postComment,
}
