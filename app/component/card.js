import React from 'react';
import { Switch, FormControlLabel } from "@mui/material";
import { PencilIcon } from "@heroicons/react/24/solid";

const StatusCard = ({ 
    bgColor, 
    icon, 
    title, 
    value, 
    hasSwitch = false, 
    switchChecked = false, 
    onSwitchChange = () => {}, 
    isLoading = false,
    hasEditButton = false,
    onEditClick = () => {}
}) => {
    return (
        <div className={`w-full ${bgColor} rounded-xl shadow-md overflow-hidden`}>
            <div className="flex items-center p-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-white/30">
                    {icon}
                </div>
                <div className="ml-4 flex-grow">
                    <div className="text-sm text-white/70">{title}</div>
                    {hasEditButton ? (
                        <div className="flex items-center">
                            <div className="text-lg font-semibold text-white mr-2">{value}</div>
                            <button
                                onClick={onEditClick}
                                className="bg-white/30 p-1 rounded-full"
                                disabled={isLoading}
                            >
                                <PencilIcon className="h-4 w-4 text-white" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-lg font-semibold text-white">{value}</div>
                    )}
                </div>
                {hasSwitch && (
                    <div className="flex items-center">
                        <FormControlLabel
                        control={
                            <Switch
                            checked={switchChecked}
                            onChange={onSwitchChange}
                            disabled={isLoading}
                            color="primary"
                            />
                        }
                        label=""
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusCard;