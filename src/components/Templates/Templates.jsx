import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../App';
import { useProfessionTheme } from '../../utils/theme';
import { useCampaign } from '../../context/CampaignContext';
import { FiEdit, FiHistory, FiEye } from 'react-icons/fi';

const TemplateGrid = styled.div`
    display: grid;
    gap: 2rem;
    padding: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
`;

const TemplatePreview = styled.div`
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
    cursor: pointer;
    border: 2px solid transparent;
    background: ${(props) => props.theme.colors.background};

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-color: ${(props) => props.theme.colors.secondary};
    }
`;

const TemplateHeader = styled.div`
    background: ${(props) => props.theme.colors.primary};
    padding: 1.5rem;
    color: ${(props) => props.theme.colors.background};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const VersionBadge = styled.span`
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
`;

const TemplateContent = styled.div`
    padding: 1.5rem;
    color: ${(props) => props.theme.colors.text};
`;

const TemplateImage = styled.div`
    height: 200px;
    background: ${(props) =>
        `linear-gradient(45deg, ${props.theme.colors.primary}30, ${props.theme.colors.secondary}30)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.primary};
`;

const TemplateActions = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
`;

const ActionButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: ${(props) => props.theme.colors.secondary};
    color: ${(props) => props.theme.colors.background};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        opacity: 0.9;
    }
`;

const TemplateItem = ({ title, description, cta, version, theme, onEdit, onHistory, onPreview }) => {
    const { setCurrentStep } = useCampaign();

    return (
        <TemplatePreview theme={theme}>
            <TemplateHeader theme={theme}>
                <h3>{title}</h3>
                <VersionBadge>{version}</VersionBadge>
            </TemplateHeader>
            <TemplateImage theme={theme}>
                <span>Template Preview</span>
            </TemplateImage>
            <TemplateContent theme={theme}>
                <p>{description}</p>
                <TemplateActions>
                    <ActionButton theme={theme} onClick={onEdit}>
                        <FiEdit /> Customize
                    </ActionButton>
                    <ActionButton theme={theme} onClick={onHistory}>
                        <FiHistory /> Versions
                    </ActionButton>
                    <ActionButton theme={theme} onClick={onPreview}>
                        <FiEye /> Preview
                    </ActionButton>
                </TemplateActions>
            </TemplateContent>
        </TemplatePreview>
    );
};

const templates = {
    legal: [
        {
            title: 'Legal Consultation',
            description: 'Professional template with case review CTA and document upload',
            cta: 'Start Legal Campaign',
            version: 'v2.1'
        },
        {
            title: 'Case Evaluation',
            description: 'Client intake form with calendar integration',
            cta: 'Launch Evaluation',
            version: 'v1.4'
        }
    ],
    medical: [
        {
            title: 'Medical Practice',
            description: 'HIPAA-compliant patient portal template',
            cta: 'Activate Medical',
            version: 'v3.0'
        },
        {
            title: 'Appointment Booking',
            description: 'Online scheduling with insurance verification',
            cta: 'Start Medical',
            version: 'v2.6'
        }
    ],
    plumbing: [
        {
            title: 'Emergency Service',
            description: '24/7 service page with call tracking',
            cta: 'Launch Plumbing',
            version: 'v1.8'
        },
        {
            title: 'Maintenance Plans',
            description: 'Subscription-based service packages',
            cta: 'Start Plumbing',
            version: 'v2.2'
        }
    ]
};

export default function Templates() {
    const { profession } = useTheme();
    const validProfession = Object.keys(templates).includes(profession) ? profession : 'legal';
    const theme = useProfessionTheme(validProfession);
    const [loading, setLoading] = useState(true);

    const handleEdit = (template) => {
        console.log('Editing template:', template);
    };

    const handleHistory = (template) => {
        console.log('Viewing history for:', template);
    };

    const handlePreview = (template) => {
        console.log('Previewing template:', template);
    };

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <TemplateGrid>
                {[1, 2].map((i) => (
                    <TemplatePreview key={i} theme={theme}>
                        <TemplateHeader theme={theme}>
                            <div
                                style={{ height: '24px', width: '60%', background: '#ffffff40' }}
                            />
                            <VersionBadge style={{ width: '40px', background: '#ffffff20' }} />
                        </TemplateHeader>
                        <TemplateImage theme={theme} />
                        <TemplateContent theme={theme}>
                            <div
                                style={{
                                    height: '16px',
                                    width: '90%',
                                    background: theme.colors.text + '20'
                                }}
                            />
                            <div
                                style={{
                                    height: '16px',
                                    width: '80%',
                                    marginTop: '8px',
                                    background: theme.colors.text + '20'
                                }}
                            />
                        </TemplateContent>
                    </TemplatePreview>
                ))}
            </TemplateGrid>
        );
    }

    return (
        <TemplateGrid>
            {templates[validProfession].map((template, index) => (
                <TemplateItem
                    key={index}
                    {...template}
                    theme={theme}
                    onEdit={() => handleEdit(template)}
                    onHistory={() => handleHistory(template)}
                    onPreview={() => handlePreview(template)}
                />
            ))}
        </TemplateGrid>
    );
}