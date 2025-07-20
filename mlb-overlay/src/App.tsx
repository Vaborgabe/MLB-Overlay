import './App.css';
import HostLayout from './components/hostLayout/hostLayout';
import { vdoCTX, VdoIframe } from "./components/vdoFrame/vdoCtx";

function App() {

  return (
    <vdoCTX.Provider value={{
            p1Cam: new VdoIframe(''),
            p2Cam: new VdoIframe(''),
            hostCams: []
    }}>
      <HostLayout />
    </vdoCTX.Provider>
  )
}

export default App

//