import { Routes , Route} from 'react-router-dom';
import './App.css';
import Docket from './Docket';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return <>
  <Routes>
    <Route path='' element={<Docket/>} />
  </Routes>
  </>
}

export default App;
