import types from '../constants/auth.types'

const initialState = {
    isAuthenticated: false,
    loading: false,
    splash: true,
    error: null
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN_USER:
            return {
                ...state,
                isAuthenticated: false,
                loading: true,
                error: null
            }
        case types.LOGIN_SUCCESS:
            return {
                ...action.payload,
                isAuthenticated: true,
                loading: false,
                error: null
            }
        case types.LOGIN_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            }
        case types.LOGOUT:
            return {
                isAuthenticated: false,
                loading: false
            }
        default:
            return state
    }

}

export default authReducer