// bucketActions.js

import axios from 'axios';

import { toast } from 'react-toastify';

export const addModelingToBucket = (modeling_id) => async (dispatch, getState) => {
  console.log("modeling_id", modeling_id)
  try {
    const response = await axios.post(
      `http://localhost:8000/equipment/chemistry_product_id/${modeling_id}/post/`,
      {
        modeling_id,
      },
      {
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      console.log("response", response)
      console.log("responsedata", response.data)
      toast.success('Услуга добавлена в корзину');
    }
  } catch (error) {
    if (error.response.status === 409) {
      toast.warning('Уже есть в корзине');
    } else {
      toast.error('Ошибка, что-то пошло не так');
      console.error('Ошибка во время добавления услуги в корзину:', error);
    }
  }
};
