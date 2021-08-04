import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {get,post, setAll,addOne, updateOne, removeOne,} from './helpers';


/**
 * @params {string} sliceName Name associated with redux Action 
 * @params {string} base_path Base Url path used for thunk actions 
 * @params {Object} initialState state of object
 */

export default function createDetailSlice({
  sliceName,
  base_path,
  initialState,
  sub_slice
}){
  const load = createAsyncThunk(
   `${sliceName}/load`,
    async(data,{rejectWithValue}) =>{
      console.log({sliceName})
      return await get({
      url: `${base_path}/${data.header_id}/${sub_slice}/list`,
      rejectWithValue,
      })
    }
  );

  const load_unique = createAsyncThunk(
    `${sliceName}/load_unique`,
     async(data,{rejectWithValue}) =>{
       return await get({
       url: `${base_path}/${data.header_id}/${sub_slice}/${data.path}`,
       rejectWithValue,
       })
     }
   )
  
  const action = createAsyncThunk(
    `${sliceName}/action`,
    async(data,{rejectWithValue})=>{
      return await post({
        url: `${base_path}/${data.header_id}/${sub_slice}/action/${data._id}`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const create = createAsyncThunk(
    `${sliceName}/create`,
    async(data,{rejectWithValue})=>{
      return await post({
        url: `${base_path}/${data.header_id}/${sub_slice}/create`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const update = createAsyncThunk(
    `${sliceName}/update`,
      async(data,{rejectWithValue})=>{
        return await post({
        url: `${base_path}/${data.header_id}/${sub_slice}/update/${data._id}`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const unique_endpoint_batch = createAsyncThunk(
    `${sliceName}/unique_endpoint_batch`,
      async(data,{rejectWithValue})=>{
        return await post({
        url: `${base_path}/${data.header_id}/${sub_slice}/${data.path}`,
        data,
        rejectWithValue,
      })
    }
  )

  const unique_endpoint_update_single = createAsyncThunk(
    `${sliceName}/unique_endpoint_update_single`,
      async(data,{rejectWithValue})=>{
        return await post({
        url: `${base_path}/${data.header_id}/${sub_slice}/${data.path}`,
        data,
        rejectWithValue,
      })
    }
  )
  const unique_endpoint_create_single = createAsyncThunk(
    `${sliceName}/unique_endpoint_create_single`,
      async(data,{rejectWithValue})=>{
        return await post({
        url: `${base_path}/${data.header_id}/${sub_slice}/${data.path}`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const remove = createAsyncThunk(
    `${sliceName}/remove`,
      async(data,{rejectWithValue})=>{
        return await post({
          url: `${base_path}/${data.header_id}/${sub_slice}/remove/${data._id}`,
          data,
          rejectWithValue,
        })
    }
  )

  const thunks = {load, action, create, update, remove, unique_endpoint_batch,load_unique,unique_endpoint_update_single,unique_endpoint_create_single};

  const slice = createSlice({
    name: `${sliceName}`,
    initialState,
    reducers: {
      reset: (state, {payload})=>{
        return []
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
    extraReducers: {
      [load.pending]: (state,{payload}) => {
        console.log({state, payload})
        return setAll([])
      },
      [load.fulfilled]: (state,{payload}) => {
        console.log({state, payload})
        return setAll(state,payload)
      },
      [load_unique.fulfilled]: (state,{payload}) => {
        return setAll(state,payload)
      },
      [create.fulfilled]: (state,{payload}) => {
        return addOne(state,payload)
      },
      [action.fulfilled]: (state,{payload}) => {
        return updateOne(state,payload)
      },
      [update.fulfilled]: (state,{payload}) => {
        return updateOne(state,payload)
      },
      [unique_endpoint_batch.fulfilled]: (state,{payload}) => {
        return setAll(state,payload)
      },
      [unique_endpoint_create_single.fulfilled]: (state,{payload}) => {
        return addOne(state,payload)
      },
      [unique_endpoint_update_single.fulfilled]: (state,{payload}) => {
        return updateOne(state,payload)
      },
      [remove.fulfilled]: (state,{payload}) => {
        return removeOne(state,payload)
      },
    },
  })
  return {
    slice, reducer: slice.reducer, actions: slice.actions, thunks
  }

}




