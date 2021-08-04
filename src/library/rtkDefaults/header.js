import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {get,post, setAll,addOne, updateOne, removeOne,} from './helpers';


/**
 * @params {string} sliceName Name associated with redux Action 
 * @params {string} base_path Base Url path used for thunk actions 
 * @params {Object} initialState state of object
 */

export default function createHeaderSlice({
  sliceName,
  base_path,
  initialState,
}){
  const load =  createAsyncThunk(
   `${sliceName}/details`,
    async(data,{rejectWithValue}) =>{
      return await get({
      url: `${base_path}/view/${data._id}`,
      rejectWithValue,
      })
    }
  );

  const load_id = createAsyncThunk(
    `${sliceName}/load_id`,
     async(data,{rejectWithValue}) =>{
       return await get({
       url: `${base_path}/view/${data._id}`,
       rejectWithValue,
       })
     }
   )
  
  const create =  createAsyncThunk(
    `${sliceName}/create`,
    async(data,{rejectWithValue})=>{
      return await post({
        url: `${base_path}/create`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const action =  createAsyncThunk(
    `${sliceName}/action`,
    async(data,{rejectWithValue})=>{
      return await post({
        url: `${base_path}/action/${data._id}`,
        data,
        rejectWithValue,
      })
    }
  )

  const unique_end_point =  createAsyncThunk(
    `${sliceName}/unique_end_point`,
    async(data,{rejectWithValue})=>{
      return await post({
        url: `${base_path}/${data.path}/${data._id}`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const update =  createAsyncThunk(
    `${sliceName}/update`,
      async(data,{rejectWithValue})=>{
        return await post({
        url: `${base_path}/update/${data._id}`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const remove =  createAsyncThunk(
    `${sliceName}/remove`,
      async(data,{rejectWithValue})=>{
        return await post({
          url: `${base_path}/remove/${data._id}`,
          data,
          rejectWithValue,
        })
    }
  )
  
  const thunks = {
    load,load_id, create, action, update, remove,unique_end_point
  }

  const slice = createSlice({
    name: `${sliceName}`,
    initialState,
    reducers: {
      reset: (state, {payload})=>{
        return {}
      },
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
    extraReducers:{
      [load.fulfilled]: (state,{payload}) => {
        return {...payload}
      },
      [load_id.fulfilled]: (state,{payload}) => {
        return {...payload}
      },
      [create.fulfilled]: (state,{payload}) => {
        return {...state, ...payload}
      },
      [action.fulfilled]: (state,{payload}) => {
        return {...state, ...payload}
      },
      [action.rejected]: (state,{payload}) => {
        return {...payload}
      },
      [update.fulfilled]: (state,{payload}) => {
        return {...state, ...payload}
      },
      [unique_end_point.fulfilled]: (state,{payload}) => {
        return {...state, ...payload}
      },
      [remove.fulfilled]: (state,{payload}) => {
        return {...state, ...payload}
      },
    }
  
  })
  return {
    slice, reducer: slice.reducer, actions: slice.actions, thunks
  }
}






