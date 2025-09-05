import React from 'react';

export type ScreenList = {
  Home: React.LazyExoticComponent<React.ComponentType<any>>;
  Splash: React.LazyExoticComponent<React.ComponentType<any>>;
  Login: React.LazyExoticComponent<React.ComponentType<any>>;
  Register: React.LazyExoticComponent<React.ComponentType<any>>;
  Setting: React.LazyExoticComponent<React.ComponentType<any>>;
};

const screens: ScreenList = {
  Home: React.lazy(() => import('./Home/Home')),
  Splash: React.lazy(() => import('./Splash/Splash')),
  Login: React.lazy(() => import('./Login/Login')),
  Register: React.lazy(() => import('./Register/Register')),
  Setting: React.lazy(() => import('./Setting/Setting')),
};

export default screens;
