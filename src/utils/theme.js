import { useMemo, useEffect } from 'react';

const baseTheme = {
    breakpoints: ['480px', '768px', '1024px', '1200px'],
    space: [0, 4, 8, 16, 32, 64],
    fontSizes: [12, 14, 16, 20, 24, 32],
    fonts: {
        body: "'Open Sans', sans-serif",
        heading: "'Poppins', sans-serif",
        accent: "'Montserrat', sans-serif"
    },
    colors: {
        primary: '#007BFF',
        secondary: '#FFC107',
        accent: '#F8F9FA',
        accent2: '#29ABE2',
        text: '#333',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        primaryDark: '#0056b3',
        secondaryDark: '#cc9a00',
        accentDark: '#e9ecef',
        accent2Dark: '#1c87b5',
        textDark: '#ffffff',
        backgroundDark: '#121212',
        surfaceDark: '#2d3748'
    }
};

export const professionThemes = {
    plumbing: {
        colors: {
            light: {
                primary: '#0047AB',
                secondary: '#B0E0E6',
                accent: '#FFD700',
                text: '#2F4F4F',
                background: '#F0F8FF',
                surface: '#FFFFFF'
            },
            dark: {
                primary: '#003366',
                secondary: '#006D75',
                accent: '#FFAA00',
                text: '#E0E0E0',
                background: '#001529',
                surface: '#1a202c'
            }
        }
    },
    legal: {
        colors: {
            light: {
                primary: '#800020',
                secondary: '#D8BFD8',
                accent: '#C0C0C0',
                text: '#4B0082',
                background: '#FFF5EE',
                surface: '#FFFFFF'
            },
            dark: {
                primary: '#4A0012',
                secondary: '#4B3A4B',
                accent: '#696969',
                text: '#E8D3FF',
                background: '#1A0A0A',
                surface: '#2d3748'
            }
        }
    },
    medical: {
        colors: {
            light: {
                primary: '#228B22',
                secondary: '#98FB98',
                accent: '#FF69B4',
                text: '#006400',
                background: '#F0FFF0',
                surface: '#FFFFFF'
            },
            dark: {
                primary: '#0F520F',
                secondary: '#1D6B1D',
                accent: '#B43764',
                text: '#C8FFC8',
                background: '#001A00',
                surface: '#1a202c'
            }
        }
    },
    trade: {
        colors: {
            light: {
                primary: '#3A4750',
                secondary: '#D72323',
                accent: '#F5EDDC',
                text: '#FFFFFF',
                background: '#F0F0F0',
                surface: '#FFFFFF'
            },
            dark: {
                primary: '#1D252A',
                secondary: '#801313',
                accent: '#D4C9B1',
                text: '#F0F0F0',
                background: '#1A1A1A',
                surface: '#2d3748'
            }
        }
    }
};

const getProfessionTheme = (profession) => {
    const professionMappings = {
        plumber: 'plumbing',
        lawyer: 'legal',
        doctor: 'medical'
    };
    const mappedProfession = professionMappings[profession] || profession;
    return professionThemes[mappedProfession] || {};
};

const getTheme = (profession, mode = 'light') => {
    const professionTheme = getProfessionTheme(profession);
    const colorSet = professionTheme.colors?.[mode] || {};
    return {
        ...baseTheme,
        ...professionTheme,
        colors: {
            ...baseTheme.colors,
            ...colorSet
        }
    };
};

const useTheme = (profession, mode = 'light') => {
    const theme = useMemo(() => getTheme(profession, mode), [profession, mode]);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.colors.primary);
        root.style.setProperty('--secondary', theme.colors.secondary);
        root.style.setProperty('--accent', theme.colors.accent);
        root.style.setProperty('--accent2', theme.colors.accent2);
        root.style.setProperty('--text', theme.colors.text);
        root.style.setProperty('--background', theme.colors.background);
        root.style.setProperty('--surface', theme.colors.surface);
    }, [theme]);

    return theme;
};

export { getTheme, useTheme };