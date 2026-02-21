import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Calendar, Building, Users, DollarSign, Sparkles, Heart } from 'lucide-react';

const HostQuestionnaire = () => {
    const navigate = useNavigate();
    const { category } = useParams(); // Gets 'wedding', 'conference', etc. from the URL

    const [formData, setFormData] = useState({
        location: '',
        date: '',
        venuePreference: '',
        customizationType: '',
        side: '', // Bride or Groom
        guestCount: '',
        budget: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Host Requirements Captured:", formData);
        
        // TODO: In the future, you can save this data to context/state here 
        // to filter the vendors on the next page.
        
        // Push the user to the marketplace to see their recommendations
        navigate(`/host/marketplace/${category || 'wedding'}`);
    };

    return (
        <div className="questionnaire-container">
            <div className="questionnaire-card">
                <div className="questionnaire-header">
                    <h2>Tell us about your event</h2>
                    <p>We'll use these details to recommend the perfect vendors for your {category || 'event'}.</p>
                </div>

                <form onSubmit={handleSubmit} className="questionnaire-form">
                    <div className="form-grid">
                        {/* Location */}
                        <div className="input-group">
                            <label><MapPin size={16}/> City / Location</label>
                            <input 
                                type="text" 
                                name="location" 
                                placeholder="e.g., New York, NY" 
                                value={formData.location} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Date */}
                        <div className="input-group">
                            <label><Calendar size={16}/> Event Date</label>
                            <input 
                                type="date" 
                                name="date" 
                                value={formData.date} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Venue Preference */}
                        <div className="input-group">
                            <label><Building size={16}/> Venue Preference</label>
                            <select name="venuePreference" value={formData.venuePreference} onChange={handleChange} required>
                                <option value="" disabled>Select a venue type...</option>
                                <option value="indoor">Indoor Banquet</option>
                                <option value="outdoor">Outdoor / Garden</option>
                                <option value="beach">Beachfront</option>
                                <option value="resort">Luxury Resort</option>
                                <option value="undecided">Not sure yet</option>
                            </select>
                        </div>

                        {/* Number of People */}
                        <div className="input-group">
                            <label><Users size={16}/> Estimated Guest Count</label>
                            <input 
                                type="number" 
                                name="guestCount" 
                                placeholder="e.g., 150" 
                                min="1"
                                value={formData.guestCount} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        {/* Customization Type */}
                        <div className="input-group">
                            <label><Sparkles size={16}/> Level of Customization</label>
                            <select name="customizationType" value={formData.customizationType} onChange={handleChange} required>
                                <option value="" disabled>Select customization level...</option>
                                <option value="basic">Basic (Standard Packages)</option>
                                <option value="moderate">Moderate (Some personalized elements)</option>
                                <option value="premium">Premium (Highly tailored experience)</option>
                                <option value="full">Full Custom (End-to-end bespoke design)</option>
                            </select>
                        </div>

                        {/* Budget */}
                        <div className="input-group">
                            <label><DollarSign size={16}/> Total Budget Estimate</label>
                            <select name="budget" value={formData.budget} onChange={handleChange} required>
                                <option value="" disabled>Select your budget range...</option>
                                <option value="low">Under $10,000</option>
                                <option value="medium">$10,000 - $30,000</option>
                                <option value="high">$30,000 - $75,000</option>
                                <option value="luxury">$75,000+</option>
                            </select>
                        </div>
                    </div>

                    {/* Conditional Field: Only show Bride/Groom if category is Wedding */}
                    {(!category || category === 'wedding') && (
                        <div className="input-group full-width mt-3">
                            <label><Heart size={16}/> Which side are you hosting for?</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" name="side" value="bride" onChange={handleChange} required />
                                    Bride's Side
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="side" value="groom" onChange={handleChange} required />
                                    Groom's Side
                                </label>
                                <label className="radio-label">
                                    <input type="radio" name="side" value="both" onChange={handleChange} required />
                                    Both
                                </label>
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-submit mt-4">
                        Find My Vendors
                    </button>
                </form>
            </div>

            {/* Embedded Styles for the Questionnaire */}
            <style>{`
                .questionnaire-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: calc(100vh - 80px);
                    background-color: var(--background-light, #f9fafb);
                    padding: 3rem 1rem;
                }
                .questionnaire-card {
                    background: white;
                    max-width: 800px;
                    width: 100%;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    padding: 3rem;
                    border: 1px solid var(--border-color, #e5e7eb);
                }
                .questionnaire-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }
                .questionnaire-header h2 {
                    font-size: 2rem;
                    color: var(--text-primary);
                    margin-bottom: 0.5rem;
                    font-family: var(--font-family-serif, serif);
                }
                .questionnaire-header p { color: var(--text-secondary); }
                
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .input-group.full-width { grid-column: 1 / -1; }
                .input-group label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .input-group input[type="text"], 
                .input-group input[type="date"], 
                .input-group input[type="number"], 
                .input-group select {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--border-color, #d1d5db);
                    border-radius: 6px;
                    font-size: 0.95rem;
                    background-color: #fff;
                    outline: none;
                    transition: all 0.2s;
                }
                .input-group input:focus, .input-group select:focus {
                    border-color: var(--primary-color, #c5a572);
                    box-shadow: 0 0 0 3px rgba(197, 165, 114, 0.1);
                }
                
                .radio-group {
                    display: flex;
                    gap: 2rem;
                    margin-top: 0.5rem;
                }
                .radio-label {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.95rem;
                    cursor: pointer;
                }
                .btn-submit {
                    width: 100%;
                    padding: 1rem;
                    background-color: var(--primary-color, #c5a572);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .btn-submit:hover { background-color: #b08d55; }
                .mt-3 { margin-top: 1.5rem; }
                .mt-4 { margin-top: 2.5rem; }

                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .questionnaire-card { padding: 2rem 1.5rem; }
                    .radio-group { flex-direction: column; gap: 1rem; }
                }
            `}</style>
        </div>
    );
};

export default HostQuestionnaire;