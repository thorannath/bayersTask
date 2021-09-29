import './App.css';
import Authentication from './components/Authentication/Authentication';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">

      <BrowserRouter>

        <Switch>
          <Route path="/login">
            <Authentication />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>

        </Switch>

      </BrowserRouter>
    </div>
  );
}

export default App;
