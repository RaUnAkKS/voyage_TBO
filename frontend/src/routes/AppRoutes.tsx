import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Landing from '../pages/Landing';
import CategoryRoleSelection from '../pages/CategoryRoleSelection';
import HostMarketplace from '../pages/HostMarketplace';
import HostEventForm from '../pages/HostEventForm';
import TokenPayment from '../pages/TokenPayment';
import HostDashboard from '../pages/HostDashboard';
import GuestCodeEntry from '../pages/GuestCodeEntry';
import GuestDashboard from '../pages/GuestDashboard';
import Auth from '../components/Auth';
import HostQuestionnaire from '../pages/HostQuestionnaire';
import HostCustomize from '../pages/HostCustomize';

// Vendor Portal — new nested routing architecture
import VendorLayout from '../layouts/VendorLayout';
import VendorOverview from '../pages/vendor/VendorOverview';
import VendorAnalytics from '../pages/vendor/VendorAnalytics';
import EventArchivePage from '../pages/vendor/archive/EventArchivePage';
import ArchiveDetailsPage from '../pages/vendor/archive/ArchiveDetailsPage';
import ActiveEventsPage from '../pages/vendor/active-events/ActiveEventsPage';
import ActiveEventDetailsPage from '../pages/vendor/active-events/ActiveEventDetailsPage';
import PaymentsPage from '../pages/vendor/payments/PaymentsPage';
import PaymentDetailsPage from '../pages/vendor/payments/PaymentDetailsPage';
import EventDetailsPage from '../pages/vendor/EventDetailsPage';

// Inventory sub-routes
import InventoryLayout from '../pages/vendor/inventory/InventoryLayout';
import InventoryTable from '../pages/vendor/inventory/InventoryTable';
import InventoryCalendar from '../pages/vendor/inventory/InventoryCalendar';
import InventoryHeatmap from '../pages/vendor/inventory/InventoryHeatmap';
import InventoryAllocations from '../pages/vendor/inventory/InventoryAllocations';

// Settings sub-routes
import SettingsLayout from '../pages/vendor/settings/SettingsLayout';
import ProfileSettings from '../pages/vendor/settings/ProfileSettings';
import SecuritySettings from '../pages/vendor/settings/SecuritySettings';
import NotificationSettings from '../pages/vendor/settings/NotificationSettings';
import PreferencesSettings from '../pages/vendor/settings/PreferencesSettings';
import DangerZone from '../pages/vendor/settings/DangerZone';

const AppRoutes = () => {
    return (
        <Routes>
            {/* ── Public / Host routes with MainLayout ── */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Landing />} />

                {/* Auth */}
                <Route path="login" element={<Auth initialMode="login" />} />
                <Route path="signup" element={<Auth initialMode="signup" />} />
                <Route path="forgot-password" element={<Auth initialMode="forgot-password" />} />

                {/* Category & Role Selection */}
                <Route path="category/:category" element={<CategoryRoleSelection />} />

                {/* Host Flow */}
                <Route path="host/create-event" element={<HostEventForm />} />
                <Route path="host/questionnaire/:category" element={<HostQuestionnaire />} />
                <Route path="host/customize" element={<HostCustomize />} />
                <Route path="host/marketplace/:category" element={<HostMarketplace />} />
                <Route path="payment/:packageId" element={<TokenPayment />} />

                {/* Guest Flow */}
                <Route path="guest" element={<GuestCodeEntry />} />
            </Route>

            {/* ── Dashboards (no MainLayout) ── */}
            <Route path="host/dashboard" element={<HostDashboard />} />
            <Route path="guest/dashboard" element={<GuestDashboard />} />

            {/* ══════════════════════════════════════════
                VENDOR PORTAL — Persistent nested layout
            ══════════════════════════════════════════ */}
            <Route path="/vendor" element={<VendorLayout />}>
                {/* Default → overview */}
                <Route index element={<Navigate to="overview" replace />} />

                <Route path="overview" element={<VendorOverview />} />
                <Route path="analytics" element={<VendorAnalytics />} />
                <Route path="archive" element={<EventArchivePage />} />
                <Route path="archive/:eventId" element={<ArchiveDetailsPage />} />
                <Route path="active-events" element={<ActiveEventsPage />} />
                <Route path="active-events/:eventId" element={<ActiveEventDetailsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="payments/:eventId" element={<PaymentDetailsPage />} />
                <Route path="events/:eventId" element={<EventDetailsPage />} />

                {/* Inventory with its own nested tabs */}
                <Route path="inventory" element={<InventoryLayout />}>
                    <Route index element={<InventoryTable />} />
                    <Route path="calendar" element={<InventoryCalendar />} />
                    <Route path="heatmap" element={<InventoryHeatmap />} />
                    <Route path="allocations" element={<InventoryAllocations />} />
                </Route>

                {/* Settings with its own nested tabs */}
                <Route path="settings" element={<SettingsLayout />}>
                    <Route index element={<Navigate to="profile" replace />} />
                    <Route path="profile" element={<ProfileSettings />} />
                    <Route path="security" element={<SecuritySettings />} />
                    <Route path="notifications" element={<NotificationSettings />} />
                    <Route path="preferences" element={<PreferencesSettings />} />
                    <Route path="danger" element={<DangerZone />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;