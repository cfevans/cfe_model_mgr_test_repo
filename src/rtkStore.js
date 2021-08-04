//*New Way to Establish Store
import {rtkConfigureStore, rtkSlice, complex_reducer} from '@cfevans/cfe-model-manager/rtk';


//*Define Url Params & Base URL for Routes
const urlParam = window.location.pathname.split('/')[2] || '11';

const base_url = `http://localhost:3000/users/api/3892323`;



// //* Define Redux Store Slices & Override Base Urls as required
const storeDefinition = [
  {
    sliceName: 'users',
    base_url: base_url + '/users',
    reducer_type: 'listing',
  },
  {
    sliceName: 'logged_user',
    base_url: base_url + '/users',
    reducer_type: 'header',
  },
  {
    sliceName: 'permissions',
    base_url: base_url.replace('users', 'permissions') + '/permissions',
    reducer_type: 'complex',
    subCollections: [
      {
        sliceName: 'templates',
        initialState: [],
      }
    ]
  },
]

const store = rtkConfigureStore({storeDefinition})
export default store

export function slice(sliceName, path){
  return rtkSlice({sliceName, path, storeDefinition})
}


//*Old Way to Establish store


// export default configureStore({
//   reducer: {
//     activeState: complex_reducer({
//       sliceName: 'activeState',
//       base_url: '/',
//     })
//   },
//   middleware: (getDefaultMiddleware) =>
//   getDefaultMiddleware({
//     thunk: {
//       // extraArgument: myCustomApiService,
//     },
//     serializableCheck: false,
//     immutableCheck: false,
//   })//.concat(LogRocket.reduxMiddleware()),

// })