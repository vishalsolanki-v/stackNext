"use client"
import React, { useContext, createContext, useEffect, useState } from "react";

interface ThemeContextType {
    mode: string;
    setMode: (mode: string) => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState('')
    const handleThemeProvider = () => {
        if (mode === 'dark') {
            setMode('light');
            document.documentElement.classList.add('light')
        }
        else {
            setMode('dark');
            document.documentElement.classList.add('dark');
        }
    }
    useEffect(() => {

        handleThemeProvider();

    }, [mode])

    return (
        <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>
    )

}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        console.error('warning error not defined theme')
        return;
    }
    return context;
}