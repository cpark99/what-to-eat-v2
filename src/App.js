import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import HomePage from './HomePage';
import CategoriesPage from './CategoriesPage';
import RecipesPage from './RecipesPage';
import RecipePage from './RecipePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/recipes">
          <RecipesPage />
        </Route>
        <Route path="/recipe/:id">
          <RecipePage />
        </Route>
        <Route path="/categories">
          <CategoriesPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
