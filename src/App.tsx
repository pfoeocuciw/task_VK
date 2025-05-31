import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import DataTable from './components/DataTable';
import NewRecordForm from './components/NewRecordForm';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div style={{ padding: 20 }}>
                <h1>Infinite Table</h1>
                <NewRecordForm />
                <DataTable />
            </div>
        </QueryClientProvider>
    );
}