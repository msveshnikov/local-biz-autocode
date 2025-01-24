import styled from 'styled-components';
import { useTheme } from '../../App';
import { useProfessionTheme } from '../../utils/theme';

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
    cursor: pointer;
    &:hover {
        transform: translateY(-4px);
    }
`;

const TemplateHeader = styled.div`
    background: ${(props) => props.theme.colors.primary};
    padding: 1.5rem;
    color: ${(props) => props.theme.colors.background};
`;

const TemplateContent = styled.div`
    padding: 1.5rem;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
`;

const TemplateItem = ({ title, description, cta, theme }) => {
    return (
        <TemplatePreview>
            <TemplateHeader theme={theme}>
                <h3>{title}</h3>
            </TemplateHeader>
            <TemplateContent theme={theme}>
                <p>{description}</p>
                <button
                    style={{
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background,
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        marginTop: '1rem',
                        cursor: 'pointer'
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
        },
        {
            title: 'Case Evaluation Page',
            description: 'Detailed case analysis template with document upload',
            cta: 'Start Evaluation'
        }
    ],
    medical: [
        {
            title: 'Medical Practice Homepage',
            description: 'Trust-building design for healthcare providers',
            cta: 'Book Appointment'
        },
        {
            title: 'Patient Portal Template',
            description: 'Secure patient login and appointment management',
            cta: 'View Portal'
        }
    ],
    plumbing: [
        {
            title: 'Emergency Service Page',
            description: 'Urgent-service focused layout for tradespeople',
            cta: 'Call Now'
        },
        {
            title: 'Maintenance Services',
            description: 'Preventative maintenance plans presentation',
            cta: 'Schedule Checkup'
        }
    ]
};

export default function Templates() {
    const { profession } = useTheme();
    const validProfession = Object.keys(templates).includes(profession) ? profession : 'legal';
    const theme = useProfessionTheme(validProfession);

    return (
        <TemplateGrid>
            {templates[validProfession].map((template, index) => (
                <TemplateItem key={index} {...template} theme={theme} />
            ))}
        </TemplateGrid>
    );
}