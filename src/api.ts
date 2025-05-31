import axios from 'axios';
import { Record } from './types';
export const api = axios.create({ baseURL: 'http://localhost:4000' });
export const fetchRecords = async (page: number, limit: number): Promise<Record[]> => {
    const { data } = await api.get('/records', { params: { _page: page, _limit: limit } });
    return data;
};
export const createRecord = async (newRec: Omit<Record,'id'>): Promise<Record> => {
    const { data } = await api.post('/records', newRec);
    return data;
};