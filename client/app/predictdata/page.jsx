'use client'
import Header from '@/components/Header'
import NoSSR from '@/components/NoSSR'
import TokenValidator from '@/components/TokenValidator'
import { useState, useEffect } from 'react'

export default function PredictData() {
    const [formData, setFormData] = useState({
        Temperature: '',
        RH: '',
        Ws: '',
        Rain: '',
        FFMC: '',
        DMC: '',
        ISI: '',
        Classes: '',
        Region: ''
    })
    const [prediction, setPrediction] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('Authorization')
        setToken(storedToken)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (!token) {
                throw new Error('Authorization token is missing')
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predictdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch prediction')
            }

            const data = await response.json()
            setPrediction(data.result)
        } catch (error) {
            console.error('Error:', error)
            setError(error.message || 'An error occurred during prediction')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <TokenValidator>
            <NoSSR>
                <div className="min-h-screen bg-gray-100 flex flex-col justify-between ">
                    <Header />
                    <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                            <div className="max-w-md mx-auto">
                                <h1 className="text-2xl font-semibold text-center mb-8">FWI Prediction</h1>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {Object.keys(formData).map((field) => (
                                        <input
                                            key={field}
                                            type="text"
                                            name={field}
                                            placeholder={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ))}
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        {loading ? 'Predicting...' : 'Predict'}
                                    </button>
                                </form>
                                {prediction && (
                                    <h2 className="mt-6 text-xl text-center text-gray-700">
                                        The FWI prediction is {prediction}
                                    </h2>
                                )}
                                {error && (
                                    <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </NoSSR>
        </TokenValidator>
    )
}