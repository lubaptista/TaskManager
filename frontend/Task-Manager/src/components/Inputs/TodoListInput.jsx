import React, { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi';

const TodoListInput = ({ todoList, setTodoList }) => {
    const [option, setOption] = useState('');

    //Função para lidar com a adição de uma opção
    const handleAddOption = () => {
        if(option.trim()) {
            setTodoList([...todoList, option.trim()]);
            setOption('');
        }
    };

    //Função para lidar com a deleção de uma opção
    const handleDeleteOption = (index) => {
        const updatedArr = todoList.filter((_, idx) => idx !== index);
        setTodoList(updatedArr);
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                    key={item}
                    className=''
                >
                    <p className=''>
                        <span className=''>
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>
                    <button
                        className=''
                        onClick={() => {
                            handleDeleteOption(index);
                        }}
                    >
                        <HiOutlineTrash className='' />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default TodoListInput