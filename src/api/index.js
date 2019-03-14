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

export const addAppAPI = params => request.post(`${HOST}/addApp`, params)
export const getAppsAPI = phone => request.get(`${HOST}/apps?phone=${phone}`)
export const updateAppAPI = params => request.post(`${HOST}/updateApp`, params)
export const deleteAppAPI = id => request.get(`${HOST}/deleteApp?id=${id}`)
export const addAppGroupAPI = params => request.post(`${HOST}/addAppGroup`, params)
export const updateAppGroupAPI = params => request.post(`${HOST}/updateAppGroup`, params)
export const deleteAppGroupAPI = id => request.get(`${HOST}/deleteAppGroup?id=${id}`)

export const addFormAPI = params => request.post(`${HOST}/addForm`, params)
export const getFormDetailAPI = id => request.get(`${HOST}/formDetail?id=${id}`)
export const updateFormAPI = params => request.post(`${HOST}/updateForm`, params)
export const deleteFormAPI = id => request.get(`${HOST}/deleteForm?id=${id}`)
