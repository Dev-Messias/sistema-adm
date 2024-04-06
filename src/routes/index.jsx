import {Routes, Route} from 'react-router-dom';

import Signin from '../pages/Signin';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';

import Private from './Private';

function RoutesApp(){
    return(
        <Routes>
            {/** Rota Publica */}
            <Route path='/' element={<Signin/> } />
            <Route path='/register' element={ <SignUp/> } />

            {/** Rota Privada */}
            <Route path='/dashboard' element={ <Private><Dashboard/></Private> } />
            <Route path='/profile' element={ <Private><Profile /></Private> } />
            <Route path='/customers' element={ <Private><Customers /></Private> } />
        </Routes>
    )
}

export default RoutesApp;