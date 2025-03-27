'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('Authorization') : null;

    useEffect(() => {
        setIsClient(true);
        if (!token) {
            router.push('/login');
        }
    }, [token, router]);

    const handleLogout = () => {
        localStorage.removeItem('Authorization');
        router.push('/login');
    };

    if (!token) {
        return null; 
    }

    return (
        <header className="bg-gray-800 text-white p-4 flex flex-row justify-between items-center">
            <h1 className="text-xl font-bold">FWI Prediction App</h1>
            {isClient && (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            )}
            {
                !isClient && (
                    <div className="bg-gray-200 text-gray-800 p-4 rounded">
                        login
                    </div>
                )
            }

        </header>
    );
};

export default Header;
