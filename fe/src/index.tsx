import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
import { ThemeProvider } from "./components/theme-provider"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
