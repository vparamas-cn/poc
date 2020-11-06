import types from '../constants/observation.types'

export const fetchlist = data => ({
    type: types.LIST_OBSERVATION,
    data
})

export const fetcharea = data => ({
    type: types.GET_AREA,
    data
})

export const fetchsection = data => ({
    type: types.GET_SECTION,
    data
})