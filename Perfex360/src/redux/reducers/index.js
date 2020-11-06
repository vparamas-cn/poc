import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import { createWhitelistFilter } from 'redux-persist-transform-filter'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import AsyncStorage from '@react-native-community/async-storage'
import authReducer from './auth.reducers'
import observationReducer from './observation.reducers'
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user'],
    transforms: [
        createWhitelistFilter('user', ['token'])
    ],
    stateReconciler: autoMergeLevel2
}

const rootReducer = combineReducers({
    user: authReducer,
    observation: observationReducer
})

export default persistReducer(persistConfig, rootReducer)