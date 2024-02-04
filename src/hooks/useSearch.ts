import { useState, useEffect } from 'react';

const useSearch = (searchFunction, delay) => {
    const [data, setData] = useState<{ name: string, id: string }[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query) {
                setLoading(true);
                searchFunction(query)
                    .then(response => {
                        setData(response);
                        setError(null);
                    })
                    .catch(err => setError(err))
                    .finally(() => setLoading(false));
            }
        }, delay);

        return () => clearTimeout(handler);
    }, [query, searchFunction, delay]);

    return { data, isLoading, error, setQuery };
};

export default useSearch;
