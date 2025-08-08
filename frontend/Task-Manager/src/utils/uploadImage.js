import React from 'react'
import axiosInstance from './axiosinstance';
import { API_PATHS } from './apiPaths';

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    //Append do arquivo da imagem para um form data
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Define cabeçalho para upload de arquivo
            },
        });
        return response.data; // Retorna dado da resposta
    } catch (error) {
        console.error('Erro no upload da imagem: ', error);
        throw error; // Relança erro para ser lidado
    }
};

export default uploadImage;