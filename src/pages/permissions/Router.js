import React, {useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useLocation, useParams} from 'react-router-dom'
import styled from 'styled-components';
import {BrowserRouter, Switch, Route, Link, NavLink} from 'react-router-dom'
import PermissionListing from './PermissionListing'
import PermissionDetails from './PermissionDetails'


export default function Router() {
  return (
    <div>
       <Switch>
          <Route path='*/list' component={PermissionListing}/>
          <Route path='*/permissions/details/:_id' component={PermissionDetails} />
      </Switch>     
    </div>
  )
}