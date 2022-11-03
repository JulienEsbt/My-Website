import React from 'react'
import MainPage from './pages/MainPage';
import CryptoPage from './pages/CryptoPage';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
  <Router>
    <Switch>
      <Route exact path="/" component={MainPage} />
      <Route exact path="/crypto" component={CryptoPage} />
    </Switch>
  </Router>
  )
}

export default App