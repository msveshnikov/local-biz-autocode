import { useEffect, useState } from 'react';
import { useTheme } from '../../App';
import { useProfessionTheme } from '../../utils/theme';
import { FaRegCommentDots, FaQuoteLeft, FaStar, FaFilter } from 'react-icons/fa';
import { getPlatformIcon } from '../../utils/theme';

const ReviewItem = ({ review, onResponseSelect, onConvertTestimonial }) => {
    const [response, setResponse] = useState('');
    const [showResponse, setShowResponse] = useState(false);
    const sentimentColors = { positive: '#28a745', neutral: '#ffc107', negative: '#dc3545' };
    const { theme: profession } = useTheme();
    const theme = useProfessionTheme(profession);

    return (
        <div style={{ ...styles.reviewCard, borderColor: theme.colors.primary }}>
            <div style={styles.reviewHeader}>
                <div style={styles.platformInfo}>
                    {getPlatformIcon(review.platform)}
                    <span style={styles.reviewDate}>
                        {new Date(review.date).toLocaleDateString()}
                    </span>
                </div>
                <div style={styles.ratingContainer}>
                    <div style={styles.stars}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                style={{
                                    color: i < review.rating ? '#FFC107' : '#e0e0e0'
                                }}
                            />
                        ))}
                    </div>
                    <span
                        style={{
                            ...styles.sentiment,
                            backgroundColor: sentimentColors[review.sentiment]
                        }}
                    >
                        {review.sentiment}
                    </span>
                </div>
            </div>

            <p style={styles.reviewContent}>
                <FaQuoteLeft style={{ ...styles.quoteIcon, color: theme.colors.primary }} />
                {review.content}
            </p>

            {review.author && <div style={styles.authorInfo}>- {review.author}</div>}

            <div style={styles.actionsContainer}>
                <button
                    style={{ ...styles.actionButton, backgroundColor: theme.colors.primary }}
                    onClick={() => setShowResponse(!showResponse)}
                >
                    <FaRegCommentDots /> Respond
                </button>

                <button
                    style={{ ...styles.actionButton, backgroundColor: theme.colors.secondary }}
                    onClick={() => onConvertTestimonial(review.id)}
                >
                    <FaQuoteLeft /> Convert
                </button>
            </div>

            {showResponse && (
                <div style={styles.responseSection}>
                    <select
                        style={styles.responseSelect}
                        onChange={(e) => setResponse(e.target.value)}
                        value={response}
                    >
                        <option value="">Select template</option>
                        {review.responseTemplates?.map((tpl) => (
                            <option key={tpl.id} value={tpl.content}>
                                {tpl.name}
                            </option>
                        ))}
                    </select>
                    <textarea
                        style={styles.responseInput}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Type custom response..."
                    />
                    <button
                        style={{ ...styles.sendButton, backgroundColor: theme.colors.primary }}
                        onClick={() => onResponseSelect(review.id, response)}
                    >
                        Send Response
                    </button>
                </div>
            )}
        </div>
    );
};

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlatform, setSelectedPlatform] = useState('all');
    const [selectedSentiment, setSelectedSentiment] = useState('all');
    const [error, setError] = useState(null);
    const { theme: profession } = useTheme();
    const theme = useProfessionTheme(profession);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const mockReviews = await import('./mockReviews.json');
                setReviews(mockReviews.default);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleResponse = (reviewId, responseText) => {
        setReviews(
            reviews.map((review) =>
                review.id === reviewId
                    ? { ...review, response: responseText, responded: true }
                    : review
            )
        );
    };

    const handleConvert = (reviewId) => {
        setReviews(
            reviews.map((review) =>
                review.id === reviewId ? { ...review, testimonial: true } : review
            )
        );
    };

    const filteredReviews = reviews.filter((review) => {
        const platformMatch = selectedPlatform === 'all' || review.platform.toLowerCase() === selectedPlatform;
        const sentimentMatch =
            selectedSentiment === 'all' || review.sentiment === selectedSentiment;
        return platformMatch && sentimentMatch;
    });

    const positiveCount = reviews.filter(r => r.sentiment === 'positive').length;
    const neutralCount = reviews.filter(r => r.sentiment === 'neutral').length;
    const negativeCount = reviews.filter(r => r.sentiment === 'negative').length;

    if (error) return <div style={styles.error}>Error loading reviews: {error}</div>;
    
    if (loading) return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ ...styles.title, color: theme.colors.primary }}>Review Management</h2>
                <div style={styles.filters}>
                    <div style={styles.filterGroup}>
                        <div style={{ ...styles.skeletonFilter, width: '150px' }} />
                    </div>
                    <div style={styles.filterGroup}>
                        <div style={{ ...styles.skeletonFilter, width: '120px' }} />
                    </div>
                </div>
            </div>
            <div style={styles.statsBar}>
                {[...Array(6)].map((_, index) => (
                    <div key={index} style={styles.statItem}>
                        <div style={styles.skeletonStatValue} />
                        <div style={styles.skeletonStatLabel} />
                    </div>
                ))}
            </div>
            <div style={styles.reviewsList}>
                {[...Array(3)].map((_, index) => (
                    <div key={index} style={{ ...styles.reviewCard, borderColor: '#e0e0e0' }}>
                        <div style={styles.skeletonHeader}>
                            <div style={styles.skeletonPlatform} />
                            <div style={styles.skeletonRating} />
                        </div>
                        <div style={styles.skeletonContent} />
                        <div style={styles.skeletonActions}>
                            <div style={styles.skeletonButton} />
                            <div style={styles.skeletonButton} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={{ ...styles.title, color: theme.colors.primary }}>Review Management</h2>
                <div style={styles.filters}>
                    <div style={styles.filterGroup}>
                        <FaFilter style={{ marginRight: '0.5rem' }} />
                        <select
                            style={styles.platformFilter}
                            value={selectedPlatform}
                            onChange={(e) => setSelectedPlatform(e.target.value)}
                        >
                            <option value="all">All Platforms</option>
                            <option value="google">Google</option>
                            <option value="yelp">Yelp</option>
                            <option value="facebook">Facebook</option>
                            <option value="website">Website</option>
                        </select>
                    </div>
                    <div style={styles.filterGroup}>
                        <select
                            style={styles.platformFilter}
                            value={selectedSentiment}
                            onChange={(e) => setSelectedSentiment(e.target.value)}
                        >
                            <option value="all">All Sentiments</option>
                            <option value="positive">Positive</option>
                            <option value="neutral">Neutral</option>
                            <option value="negative">Negative</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={styles.statsBar}>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>{reviews.length}</span>
                    <span style={styles.statLabel}>Total Reviews</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>{positiveCount}</span>
                    <span style={styles.statLabel}>Positive</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>{neutralCount}</span>
                    <span style={styles.statLabel}>Neutral</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>{negativeCount}</span>
                    <span style={styles.statLabel}>Negative</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>
                        {reviews.filter((r) => r.responded).length}
                    </span>
                    <span style={styles.statLabel}>Responded</span>
                </div>
                <div style={styles.statItem}>
                    <span style={styles.statValue}>
                        {reviews.filter((r) => r.testimonial).length}
                    </span>
                    <span style={styles.statLabel}>Converted</span>
                </div>
            </div>

            <div style={styles.reviewsList}>
                {filteredReviews.map((review) => (
                    <ReviewItem
                        key={review.id}
                        review={review}
                        onResponseSelect={handleResponse}
                        onConvertTestimonial={handleConvert}
                    />
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    title: {
        fontFamily: "'Poppins', sans-serif",
        margin: 0
    },
    filters: {
        display: 'flex',
        gap: '1rem'
    },
    filterGroup: {
        display: 'flex',
        alignItems: 'center'
    },
    platformFilter: {
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        fontFamily: "'Open Sans', sans-serif"
    },
    statsBar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#F8F9FA',
        borderRadius: '8px'
    },
    statItem: {
        textAlign: 'center',
        minWidth: '100px'
    },
    statValue: {
        display: 'block',
        fontFamily: "'Poppins', sans-serif",
        fontSize: '1.5rem'
    },
    statLabel: {
        fontFamily: "'Open Sans', sans-serif",
        color: '#6c757d'
    },
    reviewCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        borderLeft: '4px solid'
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    platformInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    reviewDate: {
        color: '#6c757d',
        fontSize: '0.9rem'
    },
    ratingContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    stars: {
        display: 'flex',
        gap: '0.25rem'
    },
    sentiment: {
        padding: '0.25rem 0.5rem',
        borderRadius: '12px',
        color: 'white',
        fontSize: '0.8rem'
    },
    reviewContent: {
        fontFamily: "'Open Sans', sans-serif",
        lineHeight: '1.6',
        margin: '1rem 0'
    },
    quoteIcon: {
        marginRight: '0.5rem'
    },
    authorInfo: {
        fontStyle: 'italic',
        color: '#6c757d'
    },
    actionsContainer: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem'
    },
    actionButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontFamily: "'Open Sans', sans-serif"
    },
    responseSection: {
        marginTop: '1rem',
        borderTop: '1px solid #eee',
        paddingTop: '1rem'
    },
    responseSelect: {
        width: '100%',
        padding: '0.5rem',
        marginBottom: '0.5rem',
        fontFamily: "'Open Sans', sans-serif"
    },
    responseInput: {
        width: '100%',
        minHeight: '100px',
        padding: '0.5rem',
        marginBottom: '0.5rem',
        fontFamily: "'Open Sans', sans-serif"
    },
    sendButton: {
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    error: {
        color: '#dc3545',
        padding: '2rem',
        textAlign: 'center'
    },
    skeletonFilter: {
        height: '36px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px'
    },
    skeletonStatValue: {
        width: '50px',
        height: '24px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        margin: '0 auto 8px'
    },
    skeletonStatLabel: {
        width: '80px',
        height: '16px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        margin: '0 auto'
    },
    skeletonHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem'
    },
    skeletonPlatform: {
        width: '100px',
        height: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px'
    },
    skeletonRating: {
        width: '80px',
        height: '20px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px'
    },
    skeletonContent: {
        width: '100%',
        height: '60px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '1rem'
    },
    skeletonActions: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem'
    },
    skeletonButton: {
        width: '120px',
        height: '36px',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px'
    }
};

export default Reviews;