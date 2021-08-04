import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {ReactTable} from '@cfevans/cfe-react'
import {slice} from '../../rtkStore'

export default function UserListing() {
  const dispatch = useDispatch()

  const onCreate = (data)=>{
    dispatch(
      slice('users').thunks.create({data})
    )
  }

  const onUpdate = (data)=>{
    dispatch(
      slice('users').thunks.update({data})
    )
  }

  const onRemove = (data)=>{
    console.log({data})
    dispatch(
      slice('users').thunks.remove({data})
    )
  }

  const onLoad = ()=>{
    dispatch(
      slice('users').thunks.load({query: 'hi=1dfa'})
    )
  }

  useEffect(()=>{
    onLoad()
  },[])
  
  return (
  
    <div>
        <ReactTable
          data={useSelector(s=>s.users)}
          tableHeaderName ='Modal Edit Table'
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
          columns= {[
            {
              Header: 'Person',
              columns: [
                {
                  Header: 'First Name',
                  accessor: 'firstName',
                },
                {
                  Header: 'Last Name',
                  accessor: 'lastName',
                },
                {
                  Header: 'email',
                  accessor: 'email',
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
