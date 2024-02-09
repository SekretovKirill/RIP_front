// actions/modelingsDetailsActions.js
import axios from 'axios';
import { getModelingsDetailsSlice } from '../slices/modelingsDetailsSlice';

export const getModelingsDetails = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`http://localhost:8000/equipment/${id}/`);
    dispatch(getModelingsDetailsSlice(response.data));
  } catch (error) {
    console.error(`Error fetching details for model ID: ${id}`, error);
  }
};
