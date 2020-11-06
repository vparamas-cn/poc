import { all, call } from 'redux-saga/effects'
import { authWatcher } from './auth.saga'
import { observationWatcher } from './observation.saga'

export default function* rootSaga() {
    yield all([
        call(authWatcher),
        call(observationWatcher)
    ])
}