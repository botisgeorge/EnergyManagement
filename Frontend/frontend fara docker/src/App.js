import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login/Login';
import UserHome from './Pages/User/Home/UserHome';
import Forbidden from './Pages/Error/Forbidden/Forbidden';
import AdminPage from './Pages/Admin/Admin';
import AddUser from './Pages/Admin/AddUser';
import EditUser from './Pages/Admin/EditUser';
import Devices from './Pages/Admin/Devices/Device';
import AllDevices from './Pages/Admin/Devices/AllDevices';
import AddDevice from './Pages/Admin/Devices/AddDevice';
import EditDevice from './Pages/Admin/Devices/EditDevice';


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/user/:id" element={<UserHome />} />
          <Route path="/forbidden" element={<Forbidden/>} />
          <Route path="/admin" element={<AdminPage/>} />
          <Route path="/admin/addUser" element={<AddUser/>} />
          <Route path="/edit-user/:id" element={<EditUser/>} />
          <Route path="/device/:userId" element={<Devices />} />
          <Route path="/device" element={<AllDevices/>} />
          <Route path="/admin/addDevice/:userId" element={<AddDevice/>} />
          <Route path="edit-device/:id/:owner" element={<EditDevice/>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;