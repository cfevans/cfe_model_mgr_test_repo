# RTK Model Read Me

**The following library is written in ES6 and requires the use of (import / export).**

## About
  * This library simplifies the code required to maanage database state in React / Redux.
  * The following features are provided by the API.
    * Auto Generated REST endpoints for a collection
    * Each collection can have a multiple subcollections
      * The primary collection is called: **Header Record**
      * The sub collection is called the **Detail Record**

## Initial Set-up
> ### Set-up Redux Store
> ```javascript
> import {rtkConfigureStore, rtkSlice} from '@cfevans/cfe_express_mongo';
>
>
> //*Define Url Params & Base URL for Routes
> const urlParam = window.location.pathname.split('/')[2] || '11';
>
> const base_url = `/:feature/api/${urlParam}`;
>
>
>
> //* Define Redux Store Slices & Override Base Urls as required
> const storeDefinition = [
>  {
>    sliceName: 'users',
>    base_url: base_url + '/users',
>    reducer_type: 'listing', //Limits to only a listing
>  },
>  {
>    sliceName: 'permissions',
>    base_url: base_url + '/permissions',
>    reducer_type: null, //Listing, Header, Detail provided
>  },
> ]
>
> const store = rtkConfigureStore({storeDefinition})
> 
> export default store
> 
> export function slice(sliceName, path){
>  return rtkSlice({sliceName, path, storeDefinition})
> }
>```

> ### Utilizing
> ```javascript
> //* On Load
> slice('slice_name').thunks.load({query: 'field=dfadfa'})
> 
> //* On Create
> slice('slice_name').thunks.create({data}})
> 
> //* On Update
> slice('slice_name').thunks.update({data: {_id: ''}})
> 
> //* On Remove
> slice('slice_name').thunks.remove({data: {_id: ''}})
> 
> //* Additional Paramaters for Slice
> slice(
>   slice_name // Name of Slice to be accessed
>   path //Optional: Header | Listing | Details
> )
> 
> slice().thunks.load_id({data: {_id}})
> slice().thunks.load_unique({data: {path}})
> slice().thunks.unique_end_point({data: {path, _id}}) 
> slice().thunks.bulk_create({data})
> 
> slice().action.reset()
> slice().action.setAll()
> slice().action.addOne()
> slice().action.updateOne()
> slice().action.removeOne()
> 
> 
> 
> 
>```