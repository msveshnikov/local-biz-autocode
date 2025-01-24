import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '../../context/CampaignContext';
import { professionThemes } from '../../utils/theme.js';

const CampaignBuilder = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProfession, setSelectedProfession] = useState('');
    const [budget, setBudget] = useState(500);
    const [includeDirectory, setIncludeDirectory] = useState(false);
    const [showROITooltip, setShowROITooltip] = useState(false);
    const [showDirectoryTooltip, setShowDirectoryTooltip] = useState(false);

    const { saveCampaign, calculateROI, roiPrediction, isLoading } = useCampaign();
    const navigate = useNavigate();

    const professions = ['legal', 'medical', 'plumbing'];
    const ctaLabels = {
        legal: 'Publish Legal Campaign',
        medical: 'Launch Medical Campaign',
        plumbing: 'Activate Plumbing Campaign',
        default: 'Launch Campaign'
    };

    useEffect(() => {
        if (selectedProfession && budget) {
            calculateROI(selectedProfession, budget);
        }
    }, [selectedProfession, budget, calculateROI]);

    const handleNext = () => {
        if (currentStep === 1 && !selectedProfession) return;
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setCurrentStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        try {
            await saveCampaign({
                profession: selectedProfession,
                budget,
                roiPrediction,
                includeDirectory
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Campaign submission failed:', error);
        }
    };

    const theme = professionThemes[selectedProfession] || professionThemes.default;

    return (
        <div className="campaign-builder" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div className="step-indicator" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                {[1, 2, 3].map((step) => (
                    <div
                        key={step}
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            background: currentStep >= step ? theme.colors.primary : '#ccc',
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
                    <h2 style={{ color: theme.colors.primary }}>Select Your Profession</h2>
                    <div className="profession-buttons" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                        {professions.map((profession) => (
                            <button
                                key={profession}
                                onClick={() => setSelectedProfession(profession)}
                                style={{
                                    background: selectedProfession === profession ? theme.colors.primary : '#f0f0f0',
                                    color: selectedProfession === profession ? 'white' : '#333',
                                    padding: '15px 10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
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
                    <h2 style={{ color: theme.colors.primary }}>Set Your Budget</h2>
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
                    <div style={{ margin: '20px 0', position: 'relative' }}>
                        <p 
                            onMouseEnter={() => setShowROITooltip(true)}
                            onMouseLeave={() => setShowROITooltip(false)}
                            style={{ cursor: 'help' }}
                        >
                            Predicted ROI: {roiPrediction}%
                            <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '8px' }}>
                                (Based on average performance for {selectedProfession} services)
                            </span>
                        </p>
                        {showROITooltip && (
                            <div style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#333',
                                color: '#fff',
                                padding: '8px',
                                borderRadius: '4px',
                                fontSize: '0.9em',
                                whiteSpace: 'nowrap',
                                zIndex: 100
                            }}>
                                Estimated return based on historical data for your profession
                            </div>
                        )}
                    </div>
                    <div className="directory-integration" style={{ position: 'relative' }}>
                        <label 
                            onMouseEnter={() => setShowDirectoryTooltip(true)}
                            onMouseLeave={() => setShowDirectoryTooltip(false)}
                            style={{ cursor: 'help' }}
                        >
                            <input
                                type="checkbox"
                                checked={includeDirectory}
                                onChange={(e) => setIncludeDirectory(e.target.checked)}
                                style={{ marginRight: '8px' }}
                            />
                            Include in Local Business Directory (+15% reach)
                        </label>
                        {showDirectoryTooltip && (
                            <div style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '0',
                                backgroundColor: '#333',
                                color: '#fff',
                                padding: '8px',
                                borderRadius: '4px',
                                fontSize: '0.9em',
                                whiteSpace: 'nowrap',
                                zIndex: 100
                            }}>
                                Automatic listing in partner directories for increased visibility
                            </div>
                        )}
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="confirmation">
                    <h2 style={{ color: theme.colors.primary }}>Confirm Your Campaign</h2>
                    <div style={{ margin: '20px 0' }}>
                        <p>Profession: {selectedProfession}</p>
                        <p>Budget: ${budget}/month</p>
                        <p>ROI Prediction: {roiPrediction}%</p>
                        <p>Directory Inclusion: {includeDirectory ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}

            <div className="navigation-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
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
                        disabled={!selectedProfession}
                        style={{
                            background: theme.colors.primary,
                            color: 'white',
                            padding: '10px 25px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginLeft: 'auto',
                            opacity: !selectedProfession ? 0.6 : 1
                        }}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{
                            background: isLoading ? '#999' : theme.colors.primary,
                            color: 'white',
                            padding: '10px 25px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Submitting...' : ctaLabels[selectedProfession] || ctaLabels.default}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CampaignBuilder;