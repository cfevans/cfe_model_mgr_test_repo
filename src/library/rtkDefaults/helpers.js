import axios from 'axios';
import {alerts} from './alerts';
import {createAction} from '@reduxjs/toolkit'

export const get = async ({url, data, rejectWithValue, fulfillWithValue}) =>{
  const response = await axios.get(url);
  // if(response?.data?.error|| response?.data?.error !== 'false'){
  //   rejectWithValue(response.data)
  // }
  if(response.data){
    return response.data;
  }
}

export const post = async ({url, data, rejectWithValue}) =>{

  const response = await axios.post(url,data);
  // if(response?.data?.error){
  //  return rejectWithValue(response.data)
  // }
  return response.data;
}

export const setAll = (state,data)=>{
  if(data && data.data){
    return data.data
  }
  return data
}

export const addOne = (state,data)=>{
  if(data && data.data){
    return [...state, data.data]
  }
  return [...state, data];
}

export const updateOne = (state,data,selectId)=>{
  const selectKey = selectId || '_id'
  if(data && data.data){
    return state.map((entity)=>{
      if(entity[selectKey] === data[selectKey]){
        return {...entity, ...data.data}
      }else{
        return entity
      }
    })
  }
  return state.map((entity)=>{
    if(entity[selectKey] === data[selectKey]){
      return {...entity, ...data}
    }else{
      return entity
    }
  })
}

export const removeOne = (state,data,selectId)=>{
  const selectKey = selectId || '_id'
  if(data && data.data){
    return state.filter((entity)=>{
      if(entity[selectKey] !== data[selectKey]){
        return true
      }else{
        return false
      }
    })
  }
  return state.filter((entity)=>{
    if(entity[selectKey] !== data[selectKey]){
      return true
    }else{
      return false
    }
  })
}


