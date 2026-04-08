import { useState, useEffect } from 'react';

export const useWeddingData = () => {
    const [data, setData] = useState({
        categories: [],
        products: [],
        loading: true,
        error: null as string | null
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch តែ API ណាដែលមានដំណើរការពិតប្រាកដ (ដើម្បីជៀសវាង 404 Error)
                const [resCat, resProd] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/products')
                ]);

                // ពិនិត្យមើលថាតើ API ដើរឬអត់ មុននឹងបម្លែងជា JSON
                const categoriesData = resCat.ok ? await resCat.json() : { data: [] };
                const productsData = resProd.ok ? await resProd.json() : { data: [] };

                setData({
                    // ឆែកមើល Structure .data ព្រោះ API ភាគច្រើនប្រើបែបនេះ
                    categories: categoriesData.data || categoriesData,
                    products: productsData.data || productsData,
                    loading: false,
                    error: null
                });
            } catch (err: any) {
                console.error("Fetch Error:", err);
                setData(prev => ({ ...prev, loading: false, error: err.message }));
            }
        };

        fetchAllData();
    }, []);

    return data;
};