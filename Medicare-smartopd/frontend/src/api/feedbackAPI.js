import API from './axiosConfig';

// Create feedback
export const createFeedback = async (feedbackData) => {
    try {
        const response = await API.post('/feedback', feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error creating feedback:', error);
        throw error;
    }
};

// Get all feedbacks (Admin)
export const getAllFeedbacks = async () => {
    try {
        const response = await API.get('/feedback');
        return response.data;
    } catch (error) {
        console.error('Error getting feedbacks:', error);
        throw error;
    }
};

// Update feedback status (Admin)
export const updateFeedbackStatus = async (id, status) => {
    try {
        const response = await API.put(`/feedback/${id}`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating feedback status:', error);
        throw error;
    }
};

// Delete feedback (Admin)
export const deleteFeedback = async (id) => {
    try {
        const response = await API.delete(`/feedback/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting feedback:', error);
        throw error;
    }
};

// Delete multiple feedbacks (Admin)
export const deleteMultipleFeedbacks = async (ids) => {
    try {
        const response = await API.delete('/feedback', { data: { ids } });
        return response.data;
    } catch (error) {
        console.error('Error deleting multiple feedbacks:', error);
        throw error;
    }
};

// Delete all feedbacks (Admin)
export const deleteAllFeedbacks = async () => {
    try {
        const response = await API.delete('/feedback/all');
        return response.data;
    } catch (error) {
        console.error('Error deleting all feedbacks:', error);
        throw error;
    }
};

// Get user's feedbacks
export const getUserFeedbacks = async (userId) => {
    try {
        const response = await API.get(`/feedback/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting user feedbacks:', error);
        throw error;
    }
};

// Delete multiple user's feedbacks
export const deleteUserMultipleFeedbacks = async (userId, ids) => {
    try {
        const response = await API.delete(`/feedback/user/${userId}/bulk`, { data: { ids } });
        return response.data;
    } catch (error) {
        console.error('Error deleting user multiple feedbacks:', error);
        throw error;
    }
};

// Delete all user's feedbacks
export const deleteAllUserFeedbacks = async (userId) => {
    try {
        const response = await API.delete(`/feedback/user/${userId}/all`);
        return response.data;
    } catch (error) {
        console.error('Error deleting all user feedbacks:', error);
        throw error;
    }
};
