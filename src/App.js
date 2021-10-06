import './App.css';
import Authentication from './components/Authentication/Authentication';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <div className="App">

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
    </div>
  );
}

export default App;
