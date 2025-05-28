import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes"

function App() {

  return (
    <>
      <div className='App bg-neutral-700 h-screen  w-screen'>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App