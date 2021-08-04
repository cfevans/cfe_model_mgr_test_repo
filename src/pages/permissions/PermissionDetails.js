import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation, useParams, useHistory} from 'react-router-dom'

import {FormCardState, ReactTable} from '@cfevans/cfe-react';
import {slice} from '../../rtkStore';

const permissionHeaderSlice = slice('permissions','header')
const permissionDetailSlice = slice('permissions','templates')

export default function PermissionDetails() {
  const dispatch = useDispatch()
  const {_id} = useParams();
  const header = useSelector(s=>s.permissions.header)  
  
  useEffect(()=>{
    dispatch(permissionHeaderSlice.actions.reset())
    dispatch(
      permissionHeaderSlice.thunks.load_id({_id})
      )
    },[_id])
    
    
    return (
      <div>
      <HeaderRecord/>
      <DetailRecords/>
    </div>
  )
}




function HeaderRecord (){
  const {_id} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const onSubmit = (data)=>{
      dispatch(
        permissionHeaderSlice.thunks.update({...data, _id})
      )
  }
  const onRemove = (data)=>{
      dispatch(
        permissionHeaderSlice.thunks.remove({...data, _id})
      )
      history.push('./list')
  }
    return(
      <FormCardState
      cardProps={{
        header: 'Details',
        alwaysOpen: true,
      }}
      formProps={{
          formName:'edit_details',
          item:useSelector(s=>s.permissions.header),
          columns:[
            {
              Header: 'Name',
              accessor: 'name',
              disabled: false,
            },
            {
              Header: 'Notes',
              accessor: 'notes',
            },
          ]
        }}
        onSubmit={onSubmit}
        onDelete={onRemove}

      />
    )
}


function DetailRecords(){
  const dispatch = useDispatch()
  const {_id} = useParams();
  useEffect(()=>{
    dispatch(
      permissionDetailSlice.thunks.load({header_id: _id})
      )
    }, [_id])
  const onCreate = (data)=>{
    dispatch(
      permissionDetailSlice.thunks.create({...data, header_id: _id})
    )
  }
  const onUpdate = (data)=>{
    dispatch(
      permissionDetailSlice.thunks.update({...data, header_id: _id})
    )
  }

  const onRemove = (data)=>{
    dispatch(
      permissionDetailSlice.thunks.remove({...data, header_id: _id})
    )
  }
  return (
      <ReactTable
          data={useSelector(s=>s.permissions.templates)}
          tableHeaderName ='Permission Templates'
          simpleEdit= {true}
          simpleEditCreateNew= {true}
          onRemove= {onRemove}
          onCreate= {onCreate}
          onUpdate= {onUpdate}
          disableOnRemove= {(item)=>{
            console.log({item})
            console.log(item.age)
            if(item.age < 10){return true}
            return false
          }}
          tableDiv={true}
          columns= {[
            {
              Header: 'Permissions',
              columns: [
                {
                  Header: 'Feature',
                  accessor: 'feature',
                },
                {
                  Header: 'Access Level',
                  accessor: 'access',
                  content_type: 'select-string',
                  options:['none','readonly','standard','admin','superadmin']

                },
              ],
              Footer: ''
            },

          ]
        }
      />
  )
}