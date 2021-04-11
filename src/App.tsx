import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AsteroidsListPage } from './pages/AsteroidsListPage';
import { AsteroidInfoPage } from './pages/AsteroidInfoPage';
import { AsteroidsListToDestroyPage } from './pages/AsteroidsListToDestroyPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AsteroidsListContextProvider } from './context/asteroidsListContext';

function App() {
  return (
    <AsteroidsListContextProvider>
      <Router>
        <Layout>
          <Header/>
          <Switch>
            <Route exact path='/'>
              <AsteroidsListPage/>
            </Route>
            <Route path='/:id'>
              <AsteroidInfoPage/>
            </Route>
            <Route path='/destroy'>
              <AsteroidsListToDestroyPage/>
            </Route>
          </Switch>
          <Footer/>
        </Layout>
      </Router>
    </AsteroidsListContextProvider>
  );
}

export default App;
