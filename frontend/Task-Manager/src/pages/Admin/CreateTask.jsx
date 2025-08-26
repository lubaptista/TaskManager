import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuTrash2 } from 'react-icons/lu';
import { toast } from 'react-hot-toast';
import moment from 'moment/min/moment-with-locales';
moment.locale('pt-br');

import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout'
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';
import AddAtachmentsInput from '../../components/Inputs/AddAtachmentsInput';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/layouts/DeleteAlert';

const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'Low',
        dueDate: '',
        assignedTo: [],
        todoChecklist: [],
        attachments: [],
    });

    const [currentTask, setCurrentTask] = useState(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const handleValueChange = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    };

    const clearData = () => {
        //reinicia o form
        setTaskData({
            title: '',
            description: '',
            priority: 'Low',
            dueDate: '',
            assignedTo: [],
            todoChecklist: [],
            attachments: [],  
        });
    };

    // Criar Tarefa
    const createTask = async () => {
        setLoading(true);

        try {
            const todolist = taskData.todoChecklist?.map((item) => ({
                text: item,
                completed: false,
            }));

            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
                ...taskData,
                dueDate:new Date(taskData.dueDate).toISOString(),
                todoChecklist: todolist,
            });

            toast.success("Tarefa criada com sucesso");

            clearData();
        } catch (error) {
            console.error('Erro ao criar tarefa: ', error);
            setLoading(false);
        } finally {
            setLoading(false);

        }
    };

    // Editar Tarefa
    const updateTask = async () => {
        setLoading(true);

        try {
            const todolist = taskData.todoChecklist?.map((item) => {
                const prevTodoChecklist = currentTask?.todoChecklist || [];
                const matchedTask = prevTodoChecklist?.find((task) => task.text === item);

                return {
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false,
                };
            });

            const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
                ...taskData,
                dueDate:new Date(taskData.dueDate).toISOString(),
                todoChecklist: todolist,
            });

            toast.success('Tarefa atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async () => {
        setError(null);

        // Validação da entrada/input
        if(!taskData.title.trim()) {
            setError('O título é obrigatório.');
            return;
        }

        if(!taskData.description.trim()) {
            setError('A descrição é obrigatória.');
            return;
        }

        if(!taskData.dueDate) {
            setError('A data final é obrigatória.');
            return;
        }

        if(taskData.assignedTo?.length === 0) {
            setError('Tarefa não atribuída a nenhum membro.');
            return;
        }

        if(taskData.todoChecklist?.length === 0) {
            setError('Adicione ao menos um item para executar na tarefa.');
            return;
        }

        if(taskId) {
            updateTask();
            return;
        }

        createTask();
    };

    // Busca informações da Tarefa por ID
    const getTaskDetailsById = async () => {
        try {
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));

            if (response.data) {
                const taskInfo = response.data;
                setCurrentTask(taskInfo);
                setTaskData((prevState) => ({
                    title: taskInfo.title,
                    description: taskInfo.description,
                    priority: taskInfo.priority,
                    dueDate: taskInfo.dueDate
                        ? moment(taskInfo.dueDate).utc().format('YYYY-MM-DD')
                        : '',
                    assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
                    todoChecklist: taskInfo?.todoChecklist?.map((item) => item.text) || [],
                    attachments: taskInfo?.attachments || [],  
                }));
                
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes da tarefa: ', error);
        } 
    };

    // Apagar Tarefa 
    const deleteTask = async () => {
        try {
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

            setOpenDeleteAlert(false);
            toast.success('Tarefa apagada com sucesso');
            navigate('/admin/tasks')
        } catch (error) {
            console.error('Erro ao apagar tarefa: ', error.response?.data?.message || error.message);
        } 
    };

    useEffect(() => {
        if (taskId) {
            getTaskDetailsById(taskId);
        }

        return () => {}
    }, [taskId]);

    return (
        <DashboardLayout activeMenu='Criar Tarefas'>
            <div className='mt-5'>
                <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
                    <div className='form-card col-span-3'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-xl md:text-xl font-medium'>
                                {taskId ? 'Atualizar Tarefa' : 'Criar Tarefa'}
                            </h2>

                            {taskId && (
                                <button 
                                className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer' 
                                onClick={() => setOpenDeleteAlert(true)}
                                >
                                    <LuTrash2 className='text-base' /> Apagar
                                </button>
                            )}
                        </div>

                        <div className='mt-4'>
                            <label className='text-xs font-medium text-slate-600'>
                                Título da Tarefa*
                            </label>

                            <input
                                placeholder='Criar interface de usuário do app'
                                className='form-input'
                                value={taskData.title}
                                onChange={({ target }) => handleValueChange("title", target.value)}
                            />
                        </div>
                        
                        <div className='mt-3'>
                            <label className='text-xs font-medium text-slate-600'>
                                Descrição da Tarefa*
                            </label>

                            <textarea
                                placeholder='Descrição da tarefa'
                                className='form-input'
                                rows={4}
                                value={taskData.description}
                                onChange={({ target }) => handleValueChange("description", target.value)}
                            />
                        </div>
                        
                        <div className='grid grid-cols-12 gap-4 mt-2'>
                            <div className='col-span-6 md:col-span-4'>
                               <label className='text-xs font-medium text-slate-600'>
                                    Prioridade
                                </label>

                                <SelectDropdown
                                    placeholder='Selecione a prioridade'
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleValueChange("priority", value)}
                                /> 
                            </div>

                            <div className='col-span-6 md:col-span-4'>
                               <label className='text-xs font-medium text-slate-600'>
                                    Data limite*
                                </label>

                                <input
                                    placeholder='Criar interface de usuário do app'
                                    className='form-input'
                                    value={taskData.dueDate}
                                    onChange={({ target }) => handleValueChange("dueDate", target.value)}
                                    type='date'
                                /> 
                            </div>
                            <div className='col-span-12 md:col-span-3'>
                                <label className='text-xs font-medium text-slate-600'>
                                    Atribuir a*
                                </label>

                                <SelectUsers
                                    selectedUsers={taskData.assignedTo}
                                    setSelectedUsers={(value) => {
                                        handleValueChange('assignedTo', value);
                                    }}
                                /> 
                            </div>
                        </div>

                        <div className='mt-3'>
                            <label className='text-xs font-medium text-slate-600'>
                                TODO Checklist*
                            </label>

                            <TodoListInput
                                todoList={taskData?.todoChecklist}
                                setTodoList={(value) => 
                                    handleValueChange('todoChecklist', value)
                                }
                            />
                        </div>

                        <div className='mt-3'>
                            <label className='text-xs font-medium text-slate-600'>
                                Adicionar Anexos
                            </label>

                            <AddAtachmentsInput
                                attachments={taskData?.attachments}
                                setAttachments={(value) => 
                                    handleValueChange('attachments', value)
                                }
                            />
                        </div>

                        {error && (
                            <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
                        )}

                        <div className='flex justify-end mt-7'>
                            <button
                                className='add-btn'
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {taskId ? 'Editar Tarefa' : 'Criar Tarefa'}
                            </button>
                        </div>
                    </div>
                </div>  
            </div>

            <Modal 
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title='Apagar Tarefa'
            >
                <DeleteAlert
                    content='Você tem certeza que deseja apagar esta tarefa?'
                    onDelete={() => deleteTask()}
                />
            </Modal>
        </DashboardLayout>
    )
}

export default CreateTask