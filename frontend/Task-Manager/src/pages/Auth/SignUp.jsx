import React, { useEffect, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper';
import { ProfilePhotoSelector } from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");

  const [error, setError] = useState(null);

  // Gerenciar o envio de formulário de cadastro
    const handleSignUp = async (e) => {
      e.preventDefault();
  
      if(!fullName) {
        setError("Por favor, insira seu nome completo.");
        return;
      }

      if(!validateEmail(email)) {
        setError("Por favor, insira um endereço de email válido.");
        return;
      }
  
      if(!password) {
        setError("Por favor, insira sua senha");
        return;
      }
  
      setError("");
  
      // Chamada da api de cadastro
    };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Crie uma conta!</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Junte-se hoje a nós inserindo suas informações para cadastrar-se.
        </p>
      
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Nome completo"
              placeholder="João"
              type="text"
            />

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

            <Input 
              value={password}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Token de Convite Admin"
              placeholder="Código de 6 dígitos"
              type="text"
            />
          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            Cadastrar
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Já possui uma conta? {" "}
            <Link className='font-medium text-primary underline' to='/login'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp