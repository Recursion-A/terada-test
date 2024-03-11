/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { AuthContextType } from '../Auth/authTypes';
import { initialState, authReducer } from '../Auth/authReducer';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
