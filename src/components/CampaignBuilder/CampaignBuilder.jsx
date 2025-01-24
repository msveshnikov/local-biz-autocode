import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '../../context/CampaignContext';
import { professionThemes } from '../../utils/theme.js';
import { FiAlertCircle } from 'react-icons/fi';

const CampaignBuilder = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedProfession, setSelectedProfession] = useState('');
    const [budget, setBudget] = useState(500);
    const [selectedDirectories, setSelectedDirectories] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [showTooltip, setShowTooltip] = useState({
        roi: false,
        directory: false,
        platform: false
    });

    const { saveCampaign, calculateROI, roiPrediction, isLoading } = useCampaign();
    const navigate = useNavigate();

    const professions = ['legal', 'medical', 'plumbing'];
    const directories = ['Google My Business', 'Yelp', 'Facebook'];
    const platforms = ['Facebook', 'Instagram', 'Google Ads'];
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

    const handleDirectoryToggle = (directory) => {
        setSelectedDirectories((prev) =>
            prev.includes(directory) ? prev.filter((d) => d !== directory) : [...prev, directory]
        );
    };

    const handlePlatformToggle = (platform) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
        );
    };

    const handleSubmit = async () => {
        try {
            await saveCampaign({
                profession: selectedProfession,
                budget,
                roiPrediction,
                directories: selectedDirectories,
                platforms: selectedPlatforms
            });
            navigate('/dashboard');
        } catch (error) {
            console.error('Campaign submission failed:', error);
        }
    };

    const theme = professionThemes[selectedProfession] || professionThemes.default;

    return (
        <div className="campaign-builder container">
            <div className="step-indicator metric-card">
                {[1, 2, 3, 4].map((step) => (
                    <div
                        key={step}
                        className="step-circle"
                        style={{
                            background: currentStep >= step ? theme.colors.primary : '#e0e0e0',
                            color: currentStep >= step ? 'white' : '#333'
                        }}
                    >
                        {step}
                    </div>
                ))}
            </div>

            {currentStep === 1 && (
                <div className="profession-select metric-card">
                    <h2 style={{ color: theme.colors.primary }}>Select Your Profession</h2>
                    <div className="profession-buttons">
                        {professions.map((profession) => (
                            <button
                                key={profession}
                                onClick={() => setSelectedProfession(profession)}
                                style={{
                                    background:
                                        selectedProfession === profession
                                            ? theme.colors.primary
                                            : '#f0f0f0',
                                    color: selectedProfession === profession ? 'white' : '#333'
                                }}
                            >
                                {profession.charAt(0).toUpperCase() + profession.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="budget-section metric-card">
                    <h2 style={{ color: theme.colors.primary }}>Budget Planning</h2>
                    <div className="budget-input">
                        <label>
                            Monthly Budget: ${budget}
                            <input
                                type="range"
                                min="100"
                                max="5000"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                            />
                        </label>
                    </div>
                    <div className="roi-prediction">
                        <p
                            onMouseEnter={() => setShowTooltip({ ...showTooltip, roi: true })}
                            onMouseLeave={() => setShowTooltip({ ...showTooltip, roi: false })}
                        >
                            Predicted ROI: {roiPrediction}%
                            <FiAlertCircle className="tooltip-icon" />
                        </p>
                        {showTooltip.roi && (
                            <div className="tooltip">
                                Estimated return based on historical data for your profession
                            </div>
                        )}
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="distribution-section metric-card">
                    <h2 style={{ color: theme.colors.primary }}>Distribution Channels</h2>
                    <div className="directory-integration">
                        <h3>Local Directories</h3>
                        <div className="directory-grid">
                            {directories.map((directory) => (
                                <label
                                    key={directory}
                                    className="directory-item"
                                    onMouseEnter={() =>
                                        setShowTooltip({ ...showTooltip, directory: true })
                                    }
                                    onMouseLeave={() =>
                                        setShowTooltip({ ...showTooltip, directory: false })
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedDirectories.includes(directory)}
                                        onChange={() => handleDirectoryToggle(directory)}
                                    />
                                    {directory}
                                    {showTooltip.directory && (
                                        <div className="tooltip">
                                            Increase local visibility through {directory}
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="platform-integration">
                        <h3>Social Platforms</h3>
                        <div className="platform-grid">
                            {platforms.map((platform) => (
                                <label
                                    key={platform}
                                    className="platform-item"
                                    onMouseEnter={() =>
                                        setShowTooltip({ ...showTooltip, platform: true })
                                    }
                                    onMouseLeave={() =>
                                        setShowTooltip({ ...showTooltip, platform: false })
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.includes(platform)}
                                        onChange={() => handlePlatformToggle(platform)}
                                    />
                                    {platform}
                                    {showTooltip.platform && (
                                        <div className="tooltip">
                                            Automatically publish to {platform}
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 4 && (
                <div className="confirmation metric-card">
                    <h2 style={{ color: theme.colors.primary }}>Campaign Summary</h2>
                    <div className="summary-details">
                        <p>
                            Profession: <strong>{selectedProfession}</strong>
                        </p>
                        <p>
                            Monthly Budget: <strong>${budget}</strong>
                        </p>
                        <p>
                            ROI Prediction: <strong>{roiPrediction}%</strong>
                        </p>
                        <p>
                            Directories: <strong>{selectedDirectories.join(', ') || 'None'}</strong>
                        </p>
                        <p>
                            Platforms: <strong>{selectedPlatforms.join(', ') || 'None'}</strong>
                        </p>
                    </div>
                </div>
            )}

            <div className="navigation-buttons">
                {currentStep > 1 && (
                    <button onClick={handleBack} className="btn-secondary">
                        Back
                    </button>
                )}
                {currentStep < 4 ? (
                    <button
                        onClick={handleNext}
                        disabled={!selectedProfession}
                        style={{
                            background: theme.colors.primary,
                            opacity: !selectedProfession ? 0.6 : 1
                        }}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        style={{ background: isLoading ? '#999' : theme.colors.primary }}
                    >
                        {isLoading
                            ? 'Submitting...'
                            : ctaLabels[selectedProfession] || ctaLabels.default}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CampaignBuilder;
