import { useMemo } from 'react';

const baseTheme = {
    breakpoints: ['480px', '768px', '1024px', '1200px'],
    space: [0, 4, 8, 16, 32, 64],
    fontSizes: [12, 14, 16, 20, 24, 32],
    fonts: {
        body: 'system-ui, sans-serif',
        heading: 'Arial, sans-serif'
    }
};

export const professionThemes = {
    plumbing: {
        colors: {
            primary: '#0047AB',
            secondary: '#B0E0E6',
            accent: '#FFD700',
            text: '#2F4F4F',
            background: '#F0F8FF'
        }
    },
    legal: {
        colors: {
            primary: '#800020',
            secondary: '#D8BFD8',
            accent: '#C0C0C0',
            text: '#4B0082',
            background: '#FFF5EE'
        }
    },
    medical: {
        colors: {
            primary: '#228B22',
            secondary: '#98FB98',
            accent: '#FF69B4',
            text: '#006400',
            background: '#F0FFF0'
        }
    },
    trade: {
        colors: {
            primary: '#3A4750',
            secondary: '#D72323',
            accent: '#F5EDDC',
            text: '#FFFFFF',
            background: '#F0F0F0'
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
    const validProfessions = Object.keys(professionThemes);
    const themeKey = validProfessions.includes(mappedProfession) ? mappedProfession : 'plumbing';
    return professionThemes[themeKey];
};

const getTheme = (profession) => ({
    ...baseTheme,
    ...getProfessionTheme(profession)
});

const useTheme = (profession) => useMemo(() => getTheme(profession), [profession]);

export { getTheme, useTheme };