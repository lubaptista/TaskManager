import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';
moment.locale('pt-br');

import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';
import { addThousandsSeparator } from '../../utils/helper';

import DashboardLayout from '../../components/layouts/DashboardLayout';
import InfoCard from '../../components/Cards/InfoCard';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

const COLORS = ['#8D51FF', '#00B8DB', '#7BCE00'];


const Dashboard = () => {
    useUserAuth();
    moment.locale('pt-br');

    const {user} = useContext(UserContext);

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const [barChartData, setBarChartData] = useState([]);

    //Prepara Dados para o chart
    const prepareChartData = (data) => {
        const taskDistribuition = data?.taskDistribuition || null;
        const taskPriorityLevels = data?.taskPriorityLevels || null;

        const taskDistribuitionData = [
            { status: 'Pending', count: taskDistribuition?.Pending || 0 },
            { status: 'In Progress', count: taskDistribuition?.InProgress || 0 },
            { status: 'Completed', count: taskDistribuition?.Completed || 0 },
        ];

        setPieChartData(taskDistribuitionData);

        const PriorityLevelData = [
            { priority: 'Low', count: taskPriorityLevels?.Low || 0 },
            { priority: 'Medium', count: taskPriorityLevels?.Medium || 0 },
            { priority: 'High', count: taskPriorityLevels?.High || 0 },
        ];

        setBarChartData(PriorityLevelData);
    };

    const getDashboardData = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.TASKS.GET_DASHBOARD_DATA
            );

            if (response.data) {
                setDashboardData(response.data);
                prepareChartData(response.data?.charts || null);
            }
        } catch (error) {
            console.error('Erro ao buscar usuários: ', error);
        }
    };

    const onSeeMore = () => {
        navigate('/admin/tasks')
    }

    useEffect(() => {
        getDashboardData();

        return () => {};
    }, []);

    return (
        <DashboardLayout activeMenu='Dashboard'>
            <div className='card my-5'>
                <div>
                    <div className='col-span-3'>
                        <h2 className='text-xl md:text-2xl'>Bem vindo, {user?.name}!</h2>
                        <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
                            {moment().format('dddd, D [de] MMMM [de] YYYY')}
                        </p>
                    </div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
                    <InfoCard
                        label='Total de Tarefas'
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribuition?.All || 0
                        )}
                        color='bg-primary'
                    />
                    <InfoCard
                        label='Tarefas Pendentes'
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribuition?.Pending || 0
                        )}
                        color='bg-violet-500'
                    />
                    <InfoCard
                        label='Tarefas Em Progresso'
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribuition?.InProgress || 0
                        )}
                        color='bg-cyan-500'
                    />
                    <InfoCard
                        label='Tarefas Completas'
                        value={addThousandsSeparator(
                            dashboardData?.charts?.taskDistribuition?.Completed || 0
                        )}
                        color='bg-lime-500'
                    />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
                <div>
                    <div className='card'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-medium'>Distribuição das tarefas</h5>
                        </div>

                        <CustomPieChart
                            data={pieChartData}
                            colors={COLORS}
                        />
                    </div>
                </div>

                <div>
                    <div className='card'>
                        <div className='flex items-center justify-between'>
                            <h5 className='font-medium'>Prioridade das tarefas</h5>
                        </div>

                        <CustomBarChart
                            data={barChartData}
                        />
                    </div>
                </div>

                <div className='md:col-span-2'>
                    <div className='card'>
                        <div className='flex items-center justify-between'>
                            <h5 className='text-lg'>Tarefas Recentes</h5>

                            <button className='card-btn' onClick={onSeeMore}>
                                Ver todas <LuArrowRight className='text-base' />
                            </button>
                        </div>
                        <TaskListTable tableData={dashboardData?.recentTasks || []} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );    
};

export default Dashboard