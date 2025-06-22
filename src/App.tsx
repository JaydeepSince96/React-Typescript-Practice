import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes"

function App() {

  return (
    <>
      <div className='App h-min-screen w-screen'>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App