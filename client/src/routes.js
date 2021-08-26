import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { MainPage } from "./pages/MainPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
export const useRoutes = (isAuntheticated) => {
  if (isAuntheticated) {
    return (
      <Switch>
        <Route path="/main" exact>
          <MainPage />
        </Route>
        <Route path="/settings/:id">
          <SettingsPage />
        </Route>
        <Redirect to="/main" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
