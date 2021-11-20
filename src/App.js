import './App.css';
import Authentication from './components/Authentication/Authentication';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { Provider, useDispatch } from "react-redux";
import store from "./store/index";
import Cookies from 'js-cookie';
import { loginAction } from './store/users';

function App() {
  return (
    <div className="App">
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/login">
            <Authentication />
          </Route>
          <Route path="/app">
            <Layout/>
          </Route>
          <Redirect to="/login"/>
        </Switch>
      </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
