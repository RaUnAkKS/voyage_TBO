
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Landing from '../pages/Landing';
import CategoryRoleSelection from '../pages/CategoryRoleSelection';
import HostMarketplace from '../pages/HostMarketplace';
import TokenPayment from '../pages/TokenPayment';
import HostDashboard from '../pages/HostDashboard';
import GuestCodeEntry from '../pages/GuestCodeEntry';
import GuestDashboard from '../pages/GuestDashboard';

// Import the new Auth component we created
import Auth from '../components/Auth';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Landing />} />

                {/* Authentication Routes */}
                <Route path="login" element={<Auth initialMode="login" />} />
                <Route path="signup" element={<Auth initialMode="signup" />} />
                <Route path="forgot-password" element={<Auth initialMode="forgot-password" />} /> {/* NEW: Added Forgot Password Route */}

                {/* Category & Role Selection */}
                <Route path="category/:category" element={<CategoryRoleSelection />} />

                {/* Host Flow */}
                <Route path="host/marketplace/:category" element={<HostMarketplace />} />
                <Route path="payment/:packageId" element={<TokenPayment />} />

                {/* Guest Flow */}
                <Route path="guest" element={<GuestCodeEntry />} />
            </Route>

            {/* Dashboards (No MainLayout or simplified) */}
            <Route path="host/dashboard" element={<HostDashboard />} />
            <Route path="guest/dashboard" element={<GuestDashboard />} />
        </Routes>
    );
};

export default AppRoutes;