"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function TestDB() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            // 1. Fetch Appointments (without technician join for now)
            const { data: appointments, error: appError } = await supabase
                .from('appointments')
                .select(`
          *,
          customer:customers(name),
          service:services(name_ar)
        `);

            if (appError) {
                setError(appError);
                return;
            }

            // 2. Fetch Profiles separately
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, full_name');

            // 3. Manual Join
            const joinedData = appointments?.map(app => ({
                ...app,
                technician: profiles?.find(p => p.id === app.technician_id)
            }));

            setData(joinedData);
        }
        fetchData();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Supabase Debug (Fixed)</h1>

            <div className="mb-4">
                <h2 className="font-bold">Error:</h2>
                <pre className="bg-red-100 p-4 rounded text-red-800">
                    {JSON.stringify(error, null, 2)}
                </pre>
            </div>

            <div>
                <h2 className="font-bold">Data ({data?.length || 0} items):</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[500px]">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    );
}
