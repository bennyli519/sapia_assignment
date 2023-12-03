import apiClient from "./client";

export const authLogin = async (params: {
  email: string;
  password: string;
}) => {
  const response = await apiClient.post(
    `${process.env.API_URL}/auth/login`,
    params
  );
  return response.data;
};
