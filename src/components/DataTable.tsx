import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useQuery } from 'react-query';
import { fetchRecords } from '../api';
import { Record } from '../types';

export default function DataTable() {
    const [page, setPage] = useState(1);
    const {
        data = [],
        isFetching,
    } = useQuery(['records', page], () => fetchRecords(page, 20), {
        keepPreviousData: true,
    });

    const loadMore = () => setPage(p => p + 1);

    // derive columns dynamically
    const columns = data.length ? Object.keys(data[0]) : [];

    return (
        <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={!isFetching && data.length % 20 === 0}
            loader={<div key="loader">Loading...</div>}
        >
            <table border={1} cellPadding={5}>
                <thead>
                <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                {data.map(rec => (
                    <tr key={rec.id}>
                        {columns.map(col => <td key={col}>{rec[col]}</td>)}
                    </tr>
                ))}
                </tbody>
            </table>
        </InfiniteScroll>
    );
}