import { useState, useEffect } from "react"
import { createViewState, JBrowseApp } from "@jbrowse/react-app2"
import { config } from "./config"
import './App.css'

type ViewModel = ReturnType<typeof createViewState>
const App = () => {
  const [viewState, setViewState] = useState<ViewModel>()

  useEffect(() => {
    const state = createViewState({
      config: {
        ...config,

        // note: workers not working in dev mode currently, planning on workaround soon
        // configuration: {
        //   rpc: {
        //     defaultDriver: 'WebWorkerRpcDriver',
        //   },
        // },
      },

      // makeWorkerInstance: () => {
      //   return new Worker(new URL('./rpcWorker', import.meta.url), {
      //     type: 'module',
      //   })
      // },
    })
    setViewState(state)
  }, [])

  if (!viewState) {
    return null
  }

  return <JBrowseApp viewState={viewState} />
}

export default App
