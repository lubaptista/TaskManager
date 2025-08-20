import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuFileSpreadsheet } from 'react-icons/lu';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import { all } from 'axios';
import TaskCard from '../../components/Cards/TaskCard';

const ManageTask = () => {
    const [allTasks, setAllTasks] = useState([]);

    const [tabs, setTabs] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');

    const navigate = useNavigate();

    const getAllTasks = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
                params: {
                    status: filterStatus === 'All' ? '' : filterStatus, 
                },
            });

            setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : []);

            // Percorre dados do statusSummary com labels fixas e ordem
            const statusSummary = response.data?.statusSummary || {};

            const statusArray = [
                { label: 'All', count: statusSummary.all || 0 }, 
                { label: 'Pending', count: statusSummary.pendingTasks || 0 }, 
                { label: 'In Progress', count: statusSummary.inProgressTasks || 0 }, 
                { label: 'Completed', count: statusSummary.completedTasks || 0 }, 
            ];

            setTabs(statusArray);

        } catch (error) {
            console.error('Erro ao buscar tarefas: ', error);
        }

    };

    const handleClick = (taskData) => {
        navigate(`/admin/create-task`, { state: { taskId: taskData._id } });
    };

    // Baixar relatório da tarefa
    const handleDownloadReport = async () => {

    };

    useEffect(() => {
        getAllTasks(filterStatus);
        return () => {};
    }, [filterStatus]);

    return (
        <DashboardLayout activeMenu="Gerenciar Tarefas">
            <div className='my-5'>
                <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
                    <div className='flex items-center justify-between gap-3'>
                        <h2 className='text-xl md:text-xl font-medium'>Minhas Tarefas</h2>

                        <button className='flex lg:hidden dowload-btn' onClick={handleDownloadReport}>
                            <LuFileSpreadsheet className='text-lg' />
                            Baixar Relatório
                        </button>
                    </div>

                    {tabs?.[0]?.count > 0 && (
                        <div className='flex items-center gap-3'>
                            <TaskStatusTabs
                                tabs={tabs}
                                activeTab={filterStatus}
                                setActiveTab={setFilterStatus}
                            />

                            <button className='hidden lg:flex download-btn' onClick={handleDownloadReport}>
                                <LuFileSpreadsheet className='text-lg' />
                                Baixar Relatório
                            </button>
                        </div>
                    )}
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                    {allTasks?.map((item, index) => (
                        <TaskCard
                            key={item._id}
                            title={item.title}
                            description={item.description}
                            priority={item.priority}
                            status={item.status}
                            progress={item.progress}
                            createdAt={item.createdAt}
                            dueDate={item.dueDate}
                            assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                            attachmentCount={item.attachments?.length || 0}
                            completedTodoCount={item.completedTodoCount || 0}
                            todoChecklist={item.todoChecklist || []}
                            onClick={() => {
                                handleClick(item);
                            }}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default ManageTask