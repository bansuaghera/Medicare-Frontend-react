# Activity Logging System - Implementation Guide

## Overview
A comprehensive activity logging system has been implemented for the Medicare-SmartOPD application. This system tracks user activities like login/logout, appointments, and prescriptions across all user roles (Admin, Doctor, Staff, Patient).

## Components Created

### Backend
1. **Activity Model** - `backend/src/models/Activity.js`
   - Tracks all system activities with timestamps
   - Stores activity type, userId, related entities, and descriptions
   - Includes indexes for performance optimization

2. **Activity Controller** - `backend/src/controllers/activityController.js`
   - Functions to log, retrieve, and manage activities
   - Support for user-specific and system-wide activity logs
   - Pagination support for large datasets

3. **Activity Routes** - `backend/src/routes/activityRoutes.js`
   - API endpoints for activity management
   - Admin-only endpoints for system-wide activities

4. **Updated Controllers**
   - `userController.js` - Logs login activities
   - `appointmentController.js` - Logs appointment booking and cancellation

### Frontend
1. **Activity API Service** - `frontend/src/api/activityAPI.js`
   - Axios-based API calls for activity operations
   - Functions: getRecentActivities, getUserActivities, getAllActivities, getSystemRecentActivities

2. **Activity Components** - `frontend/src/components/common/`
   - `ActivityItem.jsx` - Individual activity display component
   - `ActivityWidget.jsx` - Dashboard widget showing recent activities
   - `ActivitiesPage.jsx` - Full-page activity log with filtering and pagination
   - `ActivityNotificationBell.jsx` - Sidebar notification bell with dropdown
   - `ToastNotification.jsx` - Toast notifications for real-time updates

3. **Styles** - `frontend/src/components/common/activityStyles.css`
   - Complete styling for all activity components
   - Responsive design for mobile and desktop
   - Animations and transitions

## Integration Steps

### Step 1: Integrate Activity Widget to Dashboards
Add the ActivityWidget to each dashboard layout:

```jsx
import ActivityWidget from '../components/common/ActivityWidget';

// In your dashboard component
<ActivityWidget userId={currentUser.id} limit={10} />
```

**Files to Update:**
- `frontend/src/pages/admin/AdminDashboard.jsx`
- `frontend/src/pages/doctor/DoctorDashboard.jsx`
- `frontend/src/pages/staff/StaffDashboard.jsx`
- `frontend/src/pages/user/UserDashboard.jsx`

### Step 2: Integrate Notification Bell to Layouts

Add ActivityNotificationBell to the sidebar or header of each layout:

```jsx
import ActivityNotificationBell from '../components/common/ActivityNotificationBell';

// In your layout header/sidebar
<ActivityNotificationBell userId={currentUser.id} />
```

**Files to Update:**
- `frontend/src/layouts/AdminLayout.jsx`
- `frontend/src/layouts/DoctorLayout.jsx`
- `frontend/src/layouts/StaffLayout.jsx`
- `frontend/src/layouts/UserLayout.jsx`

### Step 3: Create Activity Page Route
Add the dedicated activities page to your routes:

```jsx
import ActivitiesPage from '../components/common/ActivitiesPage';

// In AppRoutes.jsx
<Route path="/activities" element={<ActivitiesPage userId={currentUser.id} />} />
```

### Step 4: Integrate Toast Notifications
Add toast notification support to the main App component:

```jsx
import { useToast } from '../components/common/ToastNotification';

function App() {
  const { toasts, addToast, ToastContainer } = useToast();

  return (
    <>
      <div>
        {/* Your routes and components */}
      </div>
      <ToastContainer />
    </>
  );
}
```

## API Endpoints

### Log Activity (Internal)
```
POST /api/activities/log
Body: {
  userId: string,
  activityType: enum[...],
  relatedUserId?: string,
  relatedEntityType?: string,
  relatedEntityId?: string,
  description?: string
}
```

### Get User Activities
```
GET /api/activities/user/:userId?limit=50&offset=0
Returns: { total, activities[] }
```

### Get Recent Activities (Limited)
```
GET /api/activities/recent/:userId
Returns: Activity[]
```

### Get All Activities (Admin Only)
```
GET /api/activities/admin?limit=100&offset=0&activityType=&userId=
Returns: { total, activities[] }
```

### Get System Recent Activities (Admin Dashboard)
```
GET /api/activities/system/recent?limit=20
Returns: Activity[]
```

## Activity Types

- `login` - User logged in
- `logout` - User logged out
- `appointment_booked` - Appointment scheduled
- `appointment_cancelled` - Appointment cancelled
- `appointment_completed` - Appointment completed
- `prescription_created` - Prescription created
- `prescription_updated` - Prescription updated
- `doctor_added` - New doctor added
- `doctor_removed` - Doctor removed
- `staff_added` - New staff added
- `staff_removed` - Staff removed
- `patient_registered` - Patient registered

## Activity Logging Examples

### In Controllers
```javascript
// When logging activities
await Activity.create({
  userId: user.id,
  activityType: 'login',
  description: `${user.name} logged in as ${user.role}`
}).catch(err => console.error('Error logging activity:', err));
```

### In Frontend
```javascript
// To log an activity from frontend
import { logActivity } from '../api/activityAPI';

await logActivity({
  userId: currentUser.id,
  activityType: 'appointment_booked',
  relatedEntityType: 'appointment',
  relatedEntityId: appointmentId,
  description: 'Appointment booked'
});
```

## Features

✅ **Activity Tracking**: Automatically logs all important system events
✅ **Real-time Display**: Shows activities across all dashboard panels
✅ **Notification System**: Bell icon with activity count and dropdown
✅ **Activity Page**: Full-featured page for viewing all activities with filtering
✅ **Role-based Access**: Users see their own activities, admins see all
✅ **Toast Notifications**: Real-time notifications for new activities
✅ **Responsive Design**: Works on mobile, tablet, and desktop
✅ **Pagination**: Handles large datasets efficiently
✅ **Timestamp Formatting**: Human-readable time (e.g., "5m ago")
✅ **Color Coding**: Different colors for different activity types

## Database Changes

Run migrations to create the Activity table. Sequelize will auto-create it on first sync, or create manually:

```sql
CREATE TABLE "Activities" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES "Users"(id),
  "activityType" VARCHAR NOT NULL,
  "relatedUserId" UUID REFERENCES "Users"(id),
  "relatedEntityType" VARCHAR DEFAULT 'none',
  "relatedEntityId" UUID,
  "description" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_userId ON "Activities"("userId");
CREATE INDEX idx_activities_createdAt ON "Activities"("createdAt");
CREATE INDEX idx_activities_activityType ON "Activities"("activityType");
```

## Next Steps to Complete Full Implementation

1. **Update All Dashboards** with ActivityWidget component
2. **Update All Layouts** with ActivityNotificationBell
3. **Add /activities route** to AppRoutes
4. **Add activity logging** to prescription controller
5. **Add activity logging** to user registration (patient_registered)
6. **Test the system** across all user roles
7. **Configure refresh intervals** as needed (currently 30s for widget, 60s for bell)

## Notes

- Activities are auto-logged on login/logout and appointment operations
- Empty old activities using the cleanup endpoint (30+ days old)
- Components are responsive and mobile-friendly
- All components include error handling and loading states
- Time formatting is automatic and human-readable

## Customization

### Change Activity Widget Refresh Rate
In `ActivityWidget.jsx`, modify the interval:
```javascript
const interval = setInterval(fetchActivities, 30000); // Change 30000ms to desired interval
```

### Change Toast Notification Duration
In `ToastNotification.jsx`, modify the timeout:
```javascript
const timer = setTimeout(onRemove, 5000); // Change 5000ms to desired duration
```

### Add New Activity Types
1. Add new type to Activity model enum
2. Add mapping in ActivityItem.jsx (formatActivityType, getActivityColor, getActivityIcon)
3. Log activity in appropriate controller
