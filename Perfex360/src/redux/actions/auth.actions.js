import types from '../constants/auth.types'

export const login = data => ({
    type: types.LOGIN_USER,
    data
})
export const logout = () => ({
    type: types.LOGOUT
})
