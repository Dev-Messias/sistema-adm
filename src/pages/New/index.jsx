import { useState, useContext, useEffect } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';

import {AuthContext} from '../../contexts/auth';

import {db} from '../../services/firebaseConnection';
import { collection, getDoc, getDocs, doc, addDoc } from 'firebase/firestore';

import { useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import './new.css';

const listRef = collection(db, "customers");

function New(){
    const { user } = useContext(AuthContext);
    const {id} = useParams();

    const [customers, setCustomers] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);

    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [customerSelected, setCustomerSelected] = useState(0);

    useEffect(() => {
        async function loadCustomers(){
            const querySnapshot =  await getDocs(listRef)
            .then((snapshot)=>{
                const lista = [];

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(snapshot.docs.size === 0){
                    console.log("Nenhuma empresa encontrada");
                    setCustomers([{ id: '1', nomeFantasia: 'Freela' }])
                    setLoadCustomers(false);
                    return;
                }

                setCustomers(lista);
                setLoadCustomers(false);

                if(id){
                    loadId(lista);
                }
            })
            .catch((error)=>{
                console.log("Erro ao buscar os clientes", error)
                setLoadCustomers(false);
                setCustomers([{ id: '1', nomeFantasia: 'Freela' }])
            })
        }

        loadCustomers();
    }, [id])

    async function loadId(lista){
        const docRef = doc(db, "chamados", id);
        await getDoc(docRef)
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    function handleOptionChange(e){
        setStatus(e.target.value);
    }

    function handleChangeSelect(e){
        setAssunto(e.target.value)
    }

    function handleChangeCustomer(e){
       setCustomerSelected(e.target.value); 
    }

    async function handleRegister(e){
        e.preventDefault();

        //registrar chamado
        await addDoc(collection(db, "chamados"),{
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid

        })
        .then(()=>{
            toast.success("Chamado registrado!😊")
            setComplemento('');
            setCustomerSelected(0)
        })
        .catch((error)=>{
            console.log(error)
            toast.error("Ops erro ao registrar, tente mais tarde! 🧐")
        })
    }


    return(
        <div>
            <Header/>
            
            <div className='content' >
                <Title name="Novo chamado" >
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container' >

                    <form className='form-profile' onSubmit={handleRegister} >

                        <label>Clientes</label>
                        {
                            loadCustomers ? (
                               <input type='text' disabled={true} value="Carregando..." />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {
                                        customers.map((item, index)=>{
                                            return(
                                                <option key={index} value={index} >
                                                    {item.nomeFantasia}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect} >
                           <option value="Suporte">Suporte</option>
                           <option value="Visita Tecnica">Visita Tecnica</option>
                           <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status' >
                            <input 
                                type="radio" 
                                name="radio"
                                value="Aberto"
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Em aberto</span>

                            <input 
                                type="radio" 
                                name="radio"
                                value="Progresso"
                                onChange={handleOptionChange}
                                checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>

                            <input 
                                type="radio" 
                                name="radio"
                                value="Atendido"
                                onChange={handleOptionChange}
                                checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea 
                            type="teste"
                            placeholder='Descreva seu problema (opcional)'
                            value={complemento}
                            onChange={(e)=> setComplemento(e.target.value)}
                        />

                        <button type='submit' >Registrar</button>

                    </form>

                </div>
            </div>
        </div>
    )
}


export default New;