import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AsteroidsListPage } from './pages/AsteroidsListPage';
import { AsteroidInfoPage } from './pages/AsteroidInfoPage';
import { AsteroidsListToDestroyPage } from './pages/AsteroidsListToDestroyPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AsteroidsListContextProvider } from './context/asteroidsListContext';
import { RequestToDestroyPage } from './pages/RequestToDestroyPage/RequestToDestroyPage';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop';

function App() {
  return (
    <AsteroidsListContextProvider>
      <Router>
        <ScrollToTop/>
        <Layout>
          <Header/>
          <Switch>
            <Route exact path='/'>
              <AsteroidsListPage/>
            </Route>
            <Route path='/asteroid/:id'>
              <AsteroidInfoPage/>
            </Route>
            <Route path='/destroy'>
              <AsteroidsListToDestroyPage/>
            </Route>
            <Route path='/request'>
              <RequestToDestroyPage/>
            </Route>
          </Switch>
          <Footer/>
        </Layout>
      </Router>
    </AsteroidsListContextProvider>
  );
}

export default App;
