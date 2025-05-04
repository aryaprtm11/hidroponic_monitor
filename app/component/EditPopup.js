import React from 'react';

const EditPopup = ({ 
    show, 
    value, 
    onChange, 
    onClose, 
    onSave, 
    title = "Edit Data",
    fieldLabel = "Nilai"
}) => {
    if (!show) return null;
    
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 max-w-md shadow-lg">
                <h2 className="text-[#B5E29B] text-xl font-bold mb-4">{title}</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {fieldLabel}
                    </label>
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        className="text-black w-full p-2 border border-gray-300 rounded"
                        autoFocus
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPopup;