import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {get,post, setAll,addOne, updateOne, removeOne,} from './helpers';


const initialState = []

export const alerts = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setAll: (state, {payload})=>{
      return setAll(state,payload)
    },
    addOne: (state, {payload})=>{
      return addOne(state,payload)
    },
    updateOne: (state, {payload})=>{
      return updateOne(state,payload)
    },
    removeOne: (state, {payload})=>{
      return removeOne(state,payload)
    },
  },
  extraReducers: (builder) =>{
    //*List
    builder
      .addMatcher(
        (action, err)=>{
          if(action.type.endsWith('/rejected')){
            return true
          }
        },
        (state, action)=>{
          console.log({action})
          let {payload} = action
          return addOne(state,payload)
        }
      )
      .addMatcher(
        (action,err)=>{
          // console.log({action})
          if(action.payload && action.payload.data && action.payload.data.alert){
            return true
          }
        },
        (state, action)=>{
          let {payload} = action
          return addOne(state,payload)
        }
      )
  }
})


export const {
setAll: actionSetAll,
addOne: actionAddOne,
updateOne: actionUpdateOne,
removeOne: actionRemoveOne,
} = alerts.actions