import request from '@/utils/request'

const HOST = 'http://192.168.1.191:8082/form'

export const loginAPI = user => request.post(`${HOST}/login`, user)
export const regAPI = user => request.post(`${HOST}/register`, user)
export const editUserAPI = user => request.post(`${HOST}/edit`, user)
export const logoutAPI = () => request.get(`${HOST}/logout`)

export const getContactsAPI = () => request.get(`${HOST}/contacts`)
export const addContactAPI = groupName => request.post(`${HOST}/addContact`, groupName)
export const delContactAPI = groupName => request.post(`${HOST}/deleteContact`, groupName)
export const getContactMembersAPI = groupId => request.get(`${HOST}/members?id=${groupId}`)
export const addMemberBatchAPI = params => request.post(`${HOST}/addMemberBatch`, params)
export const deleteMemberAPI = params => request.post(`${HOST}/deleteMember`, params)
