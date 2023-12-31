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
        if (localStorage.theme === 'dark' || 
        (!("theme" in localStorage)&&window.matchMedia("(prefers-color-scheme):dark").matches)) {
            setMode('dark');
            document.documentElement.classList.add('dark')
        }
        else {
            setMode('light');
            document.documentElement.classList.remove('dark');
        }
    }
    useEffect(() => {
        handleThemeProvider();
    }, [mode])
    console.info(mode,'mdoe',window.matchMedia("(prefers-color-scheme):dark").matches)
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