import {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import {AuthContext} from '../contexts/auth';

function Private({children}){

    const {singned, loading} = useContext(AuthContext);

    if(loading){
        return(
            <div></div>
        )
    }

    //se não estiver logado
    if(!singned){
        return <Navigate to="/"/>
    }

    return children
}

export default Private;