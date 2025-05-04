import React from 'react';

const ErrorBanner = ({ message, onRetry }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-11/12 mx-auto mt-5 mb-4">
            <p className="font-semibold">Masalah Koneksi:</p>
            <p>{message}</p>
            <button
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                onClick={onRetry}
            >
                Coba Lagi
            </button>
        </div>
    );
};

export default ErrorBanner;