import './App.css'
import {
  RouterProvider,
} from 'react-router-dom'


import {publicRouter} from './routes/index'

function App() {
  return (
    <main>
      <RouterProvider router={publicRouter}></RouterProvider>
    </main>
  )
}

export default App