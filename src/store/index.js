
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import {reduxBatch} from '@manaflair/redux-batch'
import {persistStore, persistReducer} from 'redux-persist'
import {rootReducer} from './rootReducers'
import storage from 'redux-persist/lib/storage';

const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  })
]

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware,
  enhancers: [reduxBatch],
})


export const persistor = persistStore(store)



export default store
