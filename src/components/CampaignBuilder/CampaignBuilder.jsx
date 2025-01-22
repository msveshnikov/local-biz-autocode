import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CampaignContext } from '../../context/CampaignContext';
import ProfessionTheme from '../../utils/theme';

const CampaignBuilder = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProfession, setSelectedProfession] = useState('');
    const [budget, setBudget] = useState(500);
    const [includeDirectory, setIncludeDirectory] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createCampaign } = useContext(CampaignContext);
    const navigate = useNavigate();

    const professions = ['legal', 'medical', 'plumbing'];
    const roiPrediction = budget * 2; // Simplified ROI calculation

    const handleNext = () => {
        if (currentStep === 1 && !selectedProfession) return;
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createCampaign({
                profession: selectedProfession,
                budget,
                roiPrediction,
                includeDirectory
            });
            navigate('/dashboard');
        } finally {
            setIsSubmitting(false);
        }
    };

    const theme = ProfessionTheme[selectedProfession] || ProfessionTheme.default;

    return (
        <div
            className="campaign-builder"
            style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}
        >
            <div
                className="step-indicator"
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}
            >
                {[1, 2, 3].map((step) => (
                    <div
                        key={step}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: currentStep >= step ? theme.primaryColor : '#ccc',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {step}
                    </div>
                ))}
            </div>

            {currentStep === 1 && (
                <div className="profession-select">
                    <h2 style={{ color: theme.primaryColor }}>Select Your Profession</h2>
                    <div
                        className="profession-buttons"
                        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
                    >
                        {professions.map((profession) => (
                            <button
                                key={profession}
                                onClick={() => setSelectedProfession(profession)}
                                style={{
                                    background:
                                        selectedProfession === profession
                                            ? theme.primaryColor
                                            : '#f0f0f0',
                                    color: selectedProfession === profession ? 'white' : '#333',
                                    padding: '15px 25px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {profession.charAt(0).toUpperCase() + profession.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="budget-section">
                    <h2 style={{ color: theme.primaryColor }}>Set Your Budget</h2>
                    <div style={{ margin: '20px 0' }}>
                        <label>
                            Monthly Budget: ${budget}
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                style={{ width: '100%', margin: '10px 0' }}
                            />
                        </label>
                    </div>
                    <div style={{ margin: '20px 0' }}>
                        <p>Predicted Monthly ROI: ${roiPrediction}</p>
                    </div>
                    <div className="directory-integration">
                        <label>
                            <input
                                type="checkbox"
                                checked={includeDirectory}
                                onChange={(e) => setIncludeDirectory(e.target.checked)}
                            />
                            Include in Local Business Directory
                        </label>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="confirmation">
                    <h2 style={{ color: theme.primaryColor }}>Confirm Your Campaign</h2>
                    <div style={{ margin: '20px 0' }}>
                        <p>Profession: {selectedProfession}</p>
                        <p>Budget: ${budget}/month</p>
                        <p>Directory Inclusion: {includeDirectory ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}

            <div
                className="navigation-buttons"
                style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}
            >
                {currentStep > 1 && (
                    <button
                        onClick={handleBack}
                        style={{
                            background: '#666',
                            color: 'white',
                            padding: '10px 25px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Back
                    </button>
                )}

                {currentStep < 3 ? (
                    <button
                        onClick={handleNext}
                        style={{
                            background: theme.primaryColor,
                            color: 'white',
                            padding: '10px 25px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginLeft: 'auto'
                        }}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                            background: isSubmitting ? '#999' : theme.primaryColor,
                            color: 'white',
                            padding: '10px 25px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Launch Campaign'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CampaignBuilder;
