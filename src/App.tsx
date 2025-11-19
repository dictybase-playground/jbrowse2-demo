import { useState, useEffect } from "react"
import { createViewState, JBrowseApp } from "@jbrowse/react-app2"
import './App.css'
import config from "./config"

type ViewModel = ReturnType<typeof createViewState>
const App = () => {
  const [viewState, setViewState] = useState<ViewModel>()

  useEffect(() => {
    const state = createViewState({ config })
    setViewState(state)
  }, [])

  if (!viewState) {
    return null
  }

  return <JBrowseApp viewState={viewState} />
}

export default App
