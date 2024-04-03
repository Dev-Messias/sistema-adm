import { useState } from 'react';
import './signin.css';

import logo from '../../assets/logo.png';

import { Link } from 'react-router-dom';

function Signin(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return(
        <div className='container-center' >
            <div className='login' >
                <div className='login-area' >
                    <img src={logo} alt="Logo do sistema" />
                </div>
                <form>

                    <h1>Entrar</h1>
                    <input 
                        type="text" 
                        placeholder='email@email.com' 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input 
                        type="text" 
                        placeholder='******' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button>Acessar</button>
                </form>

                <Link to="/register" > Criar uma conta </Link>
            </div>
        </div>
    )
}

export default Signin;