import { EditConfig } from '../components/EditConfig'
import { MembersTable } from '../components/Table';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MembersTable />} />
        <Route path="/config/:agentId" element={<EditConfig />} />
      </Routes>
    </Router>
  )
}

export default App