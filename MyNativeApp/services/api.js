import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - Change this to your computer's IP when testing on physical device
// const BASE_URL = 'http://localhost:5001/api';
// For physical device testing: 
const BASE_URL = 'http://10.186.217.31:5001/api';

class ApiService {
  constructor() {
    this.token = null;
    this.loadToken();
  }

  // Load token from storage
  async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.log('Error loading token:', error);
    }
  }

  // Save token to storage
  async saveToken(token) {
    try {
      this.token = token;
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
      console.log('Error saving token:', error);
    }
  }

  // Remove token from storage
  async removeToken() {
    try {
      this.token = null;
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.log('Error removing token:', error);
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      console.log(`🔄 API Call: ${url}`);
      const response = await fetch(url, config);
      
      // Check if response is OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.log('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request - ADD THIS METHOD
  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Check if user is authenticated
  async isAuthenticated() {
    await this.loadToken();
    return !!this.token;
  }

  // Get current token
  getToken() {
    return this.token;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;