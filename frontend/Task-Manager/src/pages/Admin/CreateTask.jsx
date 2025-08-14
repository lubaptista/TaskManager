import React, { useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuTrash2 } from 'react-icons/lu';
import { PRIORITY_DATA } from '../../utils/data';
import SelectDropdown from '../../components/Inputs/SelectDropdown';
import SelectUsers from '../../components/Inputs/SelectUsers';
import TodoListInput from '../../components/Inputs/TodoListInput';

const CreateTask = () => {
    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'Low',
        dueDate: null,
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
            dueDate: null,
            assignedTo: [],
            todoChecklist: [],
            attachments: [],  
        });
    };

    // Criar Tarefa
    const createTask = async () => {};

    // Editar Tarefa
    const updateTask = async () => {};
    
    const handleSubmit = async () => {};

    // Busca informações da Tarefa por ID
    const getTaskDetailsById = async () => {};

    // Apagar Tarefa 
    const deleteTask = async () => {};

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
                                Título da Tarefa
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
                                Descrição da Tarefa
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
                                    Data limite
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
                                    Atribuir a 
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
                                TODO Checklist
                            </label>

                            <TodoListInput
                                todoList={taskData?.todoChecklist}
                                setTodoList={(value) => handleValueChange('todoChecklist', value)}
                            />
                        </div>
                    </div>     
                </div>  
            </div>
        </DashboardLayout>
    )
}

export default CreateTask