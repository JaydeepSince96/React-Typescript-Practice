import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes"

function App() {

  return (
    <>
      <div className='App bg-amber-500 h-screen  w-screen'>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App