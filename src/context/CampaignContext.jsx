import { createContext, useReducer, useContext, useMemo, useCallback } from 'react';
import { professionThemes } from '../utils/theme';

const PROFESSION_MULTIPLIERS = {
    plumbing: 2.8,
    legal: 3.2,
    medical: 2.5,
    default: 2.5
};

export const CampaignContext = createContext();

const initialState = {
    campaigns: [],
    currentCampaign: null,
    isLoading: false,
    error: null,
    roiPrediction: null,
    professionTypes: Object.keys(professionThemes)
};

const campaignReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CAMPAIGNS':
            return { ...state, campaigns: action.payload };
        case 'SET_CURRENT_CAMPAIGN':
            return { ...state, currentCampaign: action.payload };
        case 'UPDATE_CAMPAIGN_FIELD':
            return {
                ...state,
                currentCampaign: {
                    ...state.currentCampaign,
                    [action.field]: action.value
                }
            };
        case 'SET_ROI_PREDICTION':
            return { ...state, roiPrediction: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'RESET_CURRENT':
            return { ...state, currentCampaign: null };
        default:
            return state;
    }
};

const CampaignProvider = ({ children }) => {
    const [state, dispatch] = useReducer(campaignReducer, initialState);

    const loadCampaigns = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await fetch('/api/campaigns');
            const data = await response.json();
            dispatch({ type: 'SET_CAMPAIGNS', payload: data });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const calculateROI = useCallback((profession, budget) => {
        const multiplier = PROFESSION_MULTIPLIERS[profession] || PROFESSION_MULTIPLIERS.default;
        const roi = ((budget * multiplier - budget) / budget) * 100;
        dispatch({ type: 'SET_ROI_PREDICTION', payload: Math.round(roi) });
    }, []);

    const createCampaign = useCallback(
        async (campaignData) => {
            dispatch({ type: 'SET_LOADING', payload: true });
            try {
                const multiplier =
                    PROFESSION_MULTIPLIERS[campaignData.profession] ||
                    PROFESSION_MULTIPLIERS.default;
                const roi =
                    ((campaignData.budget * multiplier - campaignData.budget) /
                        campaignData.budget) *
                    100;

                const response = await fetch('/api/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...campaignData,
                        roiPrediction: Math.round(roi)
                    })
                });

                await loadCampaigns();
                return await response.json();
            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: error.message });
                throw error;
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        },
        [loadCampaigns]
    );

    const value = useMemo(
        () => ({
            ...state,
            dispatch,
            calculateROI,
            createCampaign,
            loadCampaigns
        }),
        [state, calculateROI, createCampaign, loadCampaigns]
    );

    return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
};

const useCampaign = () => {
    const context = useContext(CampaignContext);
    if (!context) throw new Error('useCampaign must be used within a CampaignProvider');
    return context;
};

export { CampaignProvider, useCampaign };
