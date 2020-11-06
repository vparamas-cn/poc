import { takeLatest, put } from 'redux-saga/effects'
import axios from 'axios'
import types from '../constants/auth.types'
import { api } from '../../lib/constants'

export function* loginUser(payload) {
    try {
        const data = yield axios.post(api.login, payload.data)
        yield put({ type: types.LOGIN_SUCCESS, payload: data.data.response[0] })
    }
    catch (err) {
        yield put({ type: types.LOGIN_ERROR, payload: "login failed" })
    }
}

export function* authWatcher() {
    yield takeLatest(types.LOGIN_USER, loginUser)
}