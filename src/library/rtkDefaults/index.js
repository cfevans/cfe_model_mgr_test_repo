/* eslint-disable no-undef */
/* eslint-disable no-empty-pattern */
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import headerSlice from './header'
import detailSlice from './details'
import listingSlice from './listing';
import {alerts} from './alerts';


//*Establish Store
//*Sample Inputs
// const storeDefinition = [
//   {
//     sliceName: 'users',
//     base_url,
//     reducer_type: 'listing',
//   },
//   {
//     sliceName: 'projects',
//     base_url,
//     reducer_type: 'complex',
//   },
// ]


export function rtkConfigureStore({storeDefinition}){
  // console.log('reducer', buildReducer(storeDefinition, 'sliceName'))
  console.log({storeDefinition})
  const store = configureStore({
    reducer: buildReducer(storeDefinition,'sliceName'),
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        // extraArgument: myCustomApiService,
      },
      serializableCheck: false,
      immutableCheck: false,
    })
  })
  console.log({store})
  return store
}

//*Build Reducer from Array of Inputs 
function buildReducer (array, key){
  const initialValue = {};
  let arrayReducer =  array.reduce((obj, item) => {
    if(item.reducer_type === 'listing'){
      return {
        [item[key]]: listingSlice({
          sliceName: item[key],
          base_url: obj.base_url,
          initialState: []
        }).reducer
      };
    }
    if(item.reducer_type === 'header'){
      return {
        [item[key]]: headerSlice({
          sliceName: item[key],
          base_url: obj.base_url,
          initialState: []
        }).reducer
      };
    }

    return {
      [item[key]]: complex_reducer({
        sliceName: item[key],
        base_url: obj.base_url,
        ...item
      }),
      ...obj
    };
  }, initialValue);
  // console.log({arrayReducer})
  return {
    ...arrayReducer,
    alerts: alerts.reducer, 
  }
};

//*Build Complex Reducer
export const complex_reducer = ({
  sliceName,
  base_url,
  listingInitialState,
  headerInitialState,
  detailsInitialState,
  subCollections,
}) => {
  const subCollectionsCompiled = {}
  if(subCollections){
    for(let sub of subCollections){
      subCollectionsCompiled[sub.sliceName] = detailSlice({
        base_path: base_url,
        sliceName: `${sliceName}/${sub.sliceName}`,
        initialState: sub.initialState || []
      }).reducer
    }
  }

  return combineReducers({
    listing: listingSlice({
      sliceName: `${sliceName}/listing`,
      base_path: base_url,
      initialState: listingInitialState || [],
    }).reducer,
    
    header: headerSlice({
      base_path: base_url,
      sliceName: `${sliceName}/header`,
      initialState: headerInitialState || {},
    }).reducer,

    details: detailSlice({
      base_path: base_url,
      sliceName: `${sliceName}/details`,
      initialState: detailsInitialState || [],
    }).reducer,

    ...subCollectionsCompiled,
  })
}



export function rtkSlice({sliceName, path, storeDefinition}){
  const slice = storeDefinition.find(s=>s.sliceName === sliceName)
  const {base_url, reducer_type} = slice;
  const base_path = base_url
  if(reducer_type === 'listing'){
    return listingSlice({sliceName: `${sliceName}`, base_path})
  }
  if(reducer_type === 'header'){
    return headerSlice({sliceName: `${sliceName}`, base_path})
  }

  switch(path){
    case 'listing':
      return listingSlice({sliceName: `${sliceName}/listing`, base_path})
    case 'header':
      return headerSlice({sliceName: `${sliceName}/header`, base_path})
    case 'details':
      return detailSlice({sliceName: `${sliceName}/details`, base_path, sub_slice: path})
    default: 
      return customSubSlice(sliceName, path, base_path, storeDefinition)
    }
  }
  
  function customSubSlice(sliceName,path,  base_path, storeDefinition){
    let slice = storeDefinition.find(s=>s.sliceName === sliceName);
    let subCollection  = slice.subCollections.find(s=>s.sliceName == path)
    if(slice && subCollection){
      return detailSlice({sliceName: `${sliceName}/${path}`, base_path, sub_slice: path})
    }

    throw new Error('No Slice Path Provided')


}