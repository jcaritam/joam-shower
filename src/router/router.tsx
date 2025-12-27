import { BrowserRouter, Route, Routes } from 'react-router';
import BabyShower from '../page/baby-shower';
import InvitationManagerWrapper from '../components/invitation-manager-wrapper';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BabyShower/>}/>
        <Route path='/invitation-manager' element={<InvitationManagerWrapper/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter