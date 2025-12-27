import { BrowserRouter, Route, Routes } from 'react-router';
import BabyShower from '../page/baby-shower';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BabyShower/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter