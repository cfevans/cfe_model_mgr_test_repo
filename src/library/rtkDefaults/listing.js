import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {get,post, setAll,addOne, updateOne, removeOne,} from './helpers';

/**
 * @params {string} base_path Base Url path used for thunk actions 
 * @params {string} sliceName Name associated with redux Action 
 * @params {Object} initialState state of object
 */
export default function listingSlice({
  base_path,
  sliceName,
  initialState
}){
  const load = createAsyncThunk(
    `${sliceName}/load`,
     async(data ,{rejectWithValue}) =>{
       return await get({
       url: `${base_path}/list`,
       rejectWithValue,
       })
     }
   )
  const load_id = createAsyncThunk(
    `${sliceName}/load_id`,
     async(data,{rejectWithValue}) =>{
       return await get({
       url: `${base_path}/${data._id}/list`,
       rejectWithValue,
       })
     }
   )
  const load_unique = createAsyncThunk(
    `${sliceName}/load_unique`,
     async(data,{rejectWithValue}) =>{
       return await get({
       url: `${base_path}/${data.path}`,
       rejectWithValue,
       })
     }
   )
   const create= createAsyncThunk(
    `${sliceName}/create`,
    async(data,{rejectWithValue})=>{
      return await post({
        url: `${base_path}/create`,
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
  const update = createAsyncThunk(
    `${sliceName}/update`,
      async(data,{rejectWithValue})=>{
        return await post({
        url: `${base_path}/update/${data._id}`,
        data,
        rejectWithValue,
      })
    }
  )
  
  const remove = createAsyncThunk(
    `${sliceName}/remove`,
      async(data,{rejectWithValue})=>{
        return await post({
          url: `${base_path}/remove/${data._id}`,
          data,
          rejectWithValue,
        })
    }
  )
  const delete_listing = createAsyncThunk(
    `${sliceName}/delete`,
      async(data,{rejectWithValue})=>{
        return await post({
          url: `${base_path}/delete_listing/${data._id}`,
          data,
          rejectWithValue,
        })
    }
  )

  const bulk_create = createAsyncThunk(
    `${sliceName}/bulk_create`,
    async(data,{rejectWithValue})=>{
      return await post({
        url: `${base_path}/bulk_create`,
        data: {array: data},
        rejectWithValue,
      })
    }
  )
  const thunks = {
    load,load_id, create, update, remove,unique_end_point, load_unique, bulk_create,delete_listing
  }

  const slice = createSlice({
    name: sliceName,
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
    extraReducers:{
      //*List
      [load.fulfilled]: (state,{payload}) => {
        return setAll(state,payload)
      },
      [load_unique.fulfilled]: (state,{payload}) => {
        return setAll(state,payload)
      },
      [bulk_create.fulfilled]: (state,{payload}) => {
        return setAll(state,payload)
      },
      [create.fulfilled]: (state,{payload}) => {
        return addOne(state,payload)
      },
      [update.fulfilled]: (state,{payload}) => {
        return updateOne(state,payload)
      },
      [update.unique_end_point]: (state,{payload}) => {
        return updateOne(state,payload)
      },
      [remove.fulfilled]: (state,{payload}) => {
        return removeOne(state,payload)
      },
      [delete_listing.fulfilled]: (state,{payload}) => {
        return setAll(state,[])
      },
    }
  });
  

   
   


  return {
    slice, reducer: slice.reducer, actions: slice.actions, thunks
  }

}







