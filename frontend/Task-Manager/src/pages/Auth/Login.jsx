import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate();

  // Gerenciar o envio de formulário de login
  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Por favor, insira um endereço de email válido.");
      return;
    }

    if(!password) {
      setError("Por favor, insira sua senha");
      return;
    }

    setError("");

    // Chamada da API de Login
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN , {
        email,
        password,
      });

      const {token, role} = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data)

        //Redireciona baseado no cargo
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error){
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Algo deu errado. Por favor, tente novamente.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Bem-vindo de volta!</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Por favor, insira suas informações para logar.
        </p>

        <form onSubmit={handleLogin}>
          <Input 
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Endereço de Email"
            placeholder="john@example.com"
            type="text"
          />

          <Input 
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            type="password"
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            LOGIN
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Não possui uma conta? {" "}
            <Link className='font-medium text-primary underline' to='/signup'>
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login