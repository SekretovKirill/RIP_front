// catalogActions.js

import axios from 'axios';
import { getCatalogSuccess } from '../slices/catalogSlice';

export const getCatalog = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:8000/equipment/', {
            withCredentials: true,
        });

        dispatch(getCatalogSuccess(response.data.equipment));
    } catch (error) {
        console.error('Ошибка получения каталога:', error);
    }
};
