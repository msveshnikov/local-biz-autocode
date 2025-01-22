import React, { useContext } from 'react';
import styled from 'styled-components';

const ProfessionThemeContext = React.createContext();

const professionThemes = {
    legal: { primary: '#2A3B4D', secondary: '#5F7D8C', accent: '#C8AD7F' },
    medical: { primary: '#004445', secondary: '#2C7873', accent: '#FFD9C0' },
    trade: { primary: '#3A4750', secondary: '#D72323', accent: '#F5EDDC' }
};

const TemplateGrid = styled.div`
    display: grid;
    gap: 2rem;
    padding: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const TemplatePreview = styled.div`
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
    &:hover {
        transform: translateY(-4px);
    }
`;

const TemplateHeader = styled.div`
    background: ${(props) => props.theme.primary};
    padding: 1.5rem;
    color: white;
`;

const TemplateContent = styled.div`
    padding: 1.5rem;
    background: white;
`;

const ProfessionThemeProvider = ({ profession, children }) => {
    const theme = professionThemes[profession] || professionThemes.legal;
    return (
        <ProfessionThemeContext.Provider value={theme}>{children}</ProfessionThemeContext.Provider>
    );
};

const TemplateItem = ({ title, description, cta }) => {
    const theme = useContext(ProfessionThemeContext);
    return (
        <TemplatePreview>
            <TemplateHeader theme={theme}>
                <h3>{title}</h3>
            </TemplateHeader>
            <TemplateContent>
                <p>{description}</p>
                <button
                    style={{
                        backgroundColor: theme.accent,
                        color: theme.primary,
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px'
                    }}
                >
                    {cta}
                </button>
            </TemplateContent>
        </TemplatePreview>
    );
};

const templates = {
    legal: [
        {
            title: 'Legal Consultation Landing',
            description: 'Professional template for legal services with case review CTA',
            cta: 'Schedule Consultation'
        }
    ],
    medical: [
        {
            title: 'Medical Practice Homepage',
            description: 'Trust-building design for healthcare providers',
            cta: 'Book Appointment'
        }
    ],
    trade: [
        {
            title: 'Emergency Service Page',
            description: 'Urgent-service focused layout for tradespeople',
            cta: 'Call Now'
        }
    ]
};

export default function Templates({ profession = 'legal' }) {
    return (
        <ProfessionThemeProvider profession={profession}>
            <TemplateGrid>
                {templates[profession].map((template, index) => (
                    <TemplateItem key={index} {...template} />
                ))}
            </TemplateGrid>
        </ProfessionThemeProvider>
    );
}
