import { takeLatest, put, select } from 'redux-saga/effects'
import axios from 'axios'
import types from '../constants/observation.types'
import { api } from '../../lib/constants'

export const getUser = state => state.user;

export function* fetchlist(payload) {
    try {
        const { token } = yield select(getUser);
        var config = { method: 'get', url: api.loadlist, headers: { 'x-access-token': token, 'Content-Type': 'application/json'},data : ''};
        const data = yield axios(config)
        yield put({ type: types.LIST_OBSERVATION_SUCCESS, payload: data.data.response })
    }
    catch (err) {
        console.log(err)
        yield put({ type: types.LIST_OBSERVATION_ERROR, payload: "failed" })
    }
}
export function* fetcharea(payload) {
    try {
        const { token } = yield select(getUser);
        var config = { method: 'get', url: api.getarea, headers: { 'x-access-token': token, 'Content-Type': 'application/json'},data : ''};
        const data = yield axios(config)
        yield put({ type: types.GET_AREA_SUCCESS, payload: data.data.response })
    }
    catch (err) {
    }
}
export function* fetchsection(payload) {
    try {
        const { token } = yield select(getUser);
        var config = { method: 'get', url: api.getsection, headers: { 'x-access-token': token, 'Content-Type': 'application/json'},data : ''};
        const data = yield axios(config)
        yield put({ type: types.GET_SECTION_SUCCESS, payload: data.data.response })
    }
    catch (err) {
    }
}

export function* observationWatcher() {
    yield takeLatest(types.LIST_OBSERVATION, fetchlist)
    yield takeLatest(types.GET_AREA, fetcharea)
    yield takeLatest(types.GET_SECTION, fetchsection)
}