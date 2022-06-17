import { createStore, combineReducers, applyMiddleware } from "redux";
import * as LogIn from "./LogIn";
import thunk from "redux-thunk";

export default function configureStore() {
  const rootReducer = combineReducers(
    {
      login: LogIn.reducer
    },
    applyMiddleware(thunk)
  );

  return createStore(rootReducer);
}
