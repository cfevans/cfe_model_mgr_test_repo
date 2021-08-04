import {Container, Navbar, Nav} from 'react-bootstrap';
import UserListing from './pages/users/UserListing'
import PermissionListing from './pages/permissions/PermissionListing'
import PermissionsDetails from './pages/permissions/PermissionDetails'
import {BrowserRouter, Switch, Route, Link, NavLink} from 'react-router-dom'


const App = ()=>(
  <Container>
    <BrowserRouter>
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Navbar</Navbar.Brand>
      <Nav className="mr-auto">
        {/* <Nav.Link>
          <NavLink to={'/users'}>
            Users
          </NavLink>
        </Nav.Link> */}
        <Nav.Link>
          <NavLink to={'/permissions/list'}>
            Permissions
          </NavLink>
        </Nav.Link>
      </Nav>
      </Navbar>
      <Switch>
        {/* <Route path='/users' component={UserListing} /> */}
        <Route path='/permissions/list' component={PermissionListing} exact/>
        <Route path='/permissions/details/:_id' component={PermissionsDetails} exact/>

      </Switch>
    </BrowserRouter>
  </Container>
)

export default App;
