import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation, useParams} from 'react-router-dom'
import styled from 'styled-components';
import {ReactTable} from '@cfevans/cfe-react'
import {slice} from '../../rtkStore'

export default function PermissionListing() {
  const dispatch = useDispatch()

  const onCreate = (data)=>{
    dispatch(
      slice('permissions', 'listing').thunks.create(data)
    )
  }

  const onUpdate = (data)=>{
    dispatch(
      slice('permissions', 'listing').thunks.update(data)
    )
  }

  const onRemove = (data)=>{
    dispatch(
      slice('permissions', 'listing').thunks.remove(data)
    )
  }

  const onLoad = ()=>{
    dispatch(
      slice('permissions', 'listing').thunks.load({})
    )
  }
  useEffect(()=>{
    onLoad()
  },[])
  
  return (
  
    <div>
        <ReactTable
          data={useSelector(s=>s.permissions.listing)}
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
                  Header: '',
                  accessor: '_id',
<<<<<<< HEAD
                  content_type: 'navlink', 
=======
                  content_type: 'navlink', //Use Navlink in Production
>>>>>>> df24b54201ed05ee683b2a5e1af8d15bf7101649
                  base_url_redirect: '/permissions/details/:_id',
                  width: 20
                },
                {
                  Header: 'Name',
                  accessor: 'name',
                },
                {
                  Header: 'Notes',
                  accessor: 'notes',
                },
              ],
              Footer: ''
            },

          ]
        }
      />
    </div>
  )
}

