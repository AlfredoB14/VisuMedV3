import {
    configureStore,
    Action,
    combineReducers,
    createAction,
  } from "@reduxjs/toolkit";
  
  import { doctorsSlice } from "./doctors/doctors.slice";
import authSlice from "./auth/auth.slice";
import { patientsSlice } from "./patients/patients.slice";
import { consultationSlice } from "./consultations/consultations.slice";

  const appReducer = combineReducers({
    doctors: doctorsSlice.reducer,
    auth: authSlice,
    patients: patientsSlice.reducer,
    consultation: consultationSlice.reducer
  });
  
  export const rootReducer = (state: any, action: Action<string>) => {
    if (action.type === "RESET_STATE") {
      return appReducer(undefined, action);
    }
    return appReducer(state, action);
  };
  
  export const store = configureStore({
    reducer: rootReducer,
    devTools: true,
  });
  
  export const restoreReduxState = createAction("RESET_STATE");
  export type AppDispatch = typeof store.dispatch;
  export type RootState = ReturnType<typeof store.getState>;
  export default store;
  