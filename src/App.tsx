import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Routes"
import { Suspense } from "react";
import GlobalSuspense from "./components/GlobalSuspense";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {

  return (
    <>
      <ThemeProvider>
        <div className='App h-min-screen w-screen'>
          <Suspense fallback={<GlobalSuspense message="Loading application..." showLayout={false} />}>
            <RouterProvider router={router} />
          </Suspense>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App