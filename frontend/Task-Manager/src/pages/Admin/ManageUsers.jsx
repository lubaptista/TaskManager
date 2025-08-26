import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import UserCard from '../../components/Cards/UserCard';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [allUsers, setAllUsers] = useState([]);

    const getAllUsers = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);

            if (response.data?.length > 0) {
                setAllUsers(response.data);
            }

        } catch (error) {
            console.error('Erro ao buscar usuários: ', error);
        }
    };

    // Baixar relatório da tarefa
    const handleDownloadReport = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
                responseType: 'blob',
            });

            // Cria a URL para o blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_details.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao baixar detalhes das tarefas dos usuários: ', error);
            toast.error('Falha ao baixar detalhes das tarefas dos usuários. Por favor tente novamente.');
        }
    };

    useEffect(() => {
            getAllUsers();

            return () => {};
        }, []);

    return (
        <DashboardLayout activeMenu='Membros do Time'>
            <div className='mt-5 mb-10'>
                <div className='flex md:flex-row md:items-center justify-between'>
                    <h2 className='text-xl md:text-xl font-medium'>Membros do Time</h2>

                    <button className='download-btn flex md:flex ' onClick={handleDownloadReport}>
                        <LuFileSpreadsheet className='text-lg' />
                        Baixar relatório
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                    {allUsers?.map((user) => (
                        <UserCard key={user._id} userInfo={user} />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ManageUsers