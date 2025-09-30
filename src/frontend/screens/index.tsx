import React from 'react';

export type ScreenList = {
  Home: React.LazyExoticComponent<React.ComponentType<any>>;
  Splash: React.LazyExoticComponent<React.ComponentType<any>>;
  Intro: React.LazyExoticComponent<React.ComponentType<any>>;
  Login: React.LazyExoticComponent<React.ComponentType<any>>;
  Register: React.LazyExoticComponent<React.ComponentType<any>>;
  Setting: React.LazyExoticComponent<React.ComponentType<any>>;
  Chat: React.LazyExoticComponent<React.ComponentType<any>>;
  Profile: React.LazyExoticComponent<React.ComponentType<any>>;
  WebView: React.LazyExoticComponent<React.ComponentType<any>>;
  Search: React.LazyExoticComponent<React.ComponentType<any>>;
};

const screens: ScreenList = {
  Home: React.lazy(() => import('./Home/Home')),
  Splash: React.lazy(() => import('./Splash/Splash')),
  Intro: React.lazy(() => import('./Intro/Intro')),
  Login: React.lazy(() => import('./Login/Login')),
  Register: React.lazy(() => import('./Register/Register')),
  Setting: React.lazy(() => import('./Setting/Setting')),
  Chat: React.lazy(() => import('./Chat/Chat')),
  Profile: React.lazy(() => import('./Profile/Profile')),
  WebView: React.lazy(() => import('./WebView/WebView')),
  Search: React.lazy(() => import('./Search/Search')),
};

export default screens;
