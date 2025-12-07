import { axiosInstance } from ".";

export const registerUser = async (values) => {
  try {
    console.log(axiosInstance.headers);
    const response = await axiosInstance.post("/api/users/register", values);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const loginUser = async (values) => {
  try {
    const response = await axiosInstance.post("/api/users/login", values);
    // console.log(response.data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/api/users/get-current-user');
    return response.data;
  }catch(error){
    return error
  }
}

export const changePassword = async (values) => {
  try {
    const response = await axiosInstance.post('/api/users/change-password', values);
    return response.data;    
  } catch (error) {
    return error;
  }
}

export const verifyEmail = async (values) => {
  try {
    const response = await axiosInstance.post('/api/users/verify-email', values);
    return response.data;    
  } catch (error) {
    return error;
  }
}

// resend OTP
export const resendOtp = async (values) => {
  try {
    const response = await axiosInstance.post("/api/users/resend-otp", values);
    return response.data;
  } catch (error) {
    return error;
  }
};