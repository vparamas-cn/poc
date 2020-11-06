import types from '../constants/observation.types'

const initialState = {
    list:[],
    arealist:[],
    sectionlist:[],
    loading: false,
}

const observationReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LIST_OBSERVATION:
            return {
                ...state,
                list:[],
                loading: true
            }
        case types.LIST_OBSERVATION_SUCCESS:
            return {
                ...state,
                list:action.payload,
                loading: false,
            }
        case types.LIST_OBSERVATION_ERROR:
            return {
                ...state,
                loading: false,
            }
        case types.GET_AREA:
            return {
                ...state,
                arealist:[]
            }
        case types.GET_AREA_SUCCESS:
            return {
                ...state,
                arealist:action.payload
            }
        case types.GET_SECTION:
            return {
                ...state,
                sectionlist:[]
            }
        case types.GET_SECTION_SUCCESS:
            return {
                ...state,
                sectionlist:action.payload
            }
        default:
            return state
    }

}

export default observationReducer