import api from "./api";

// Fetch Users
export const fetchUsersAPI = async () => {
  const response = await api.get("/users");
  return response.data;
};

// Add User
export const addUserAPI = async (user) => {
  const response = await api.post("/users", user);
  return response.data;
};

// Delete User
export const deleteUserAPI = async (id) => {
  await api.delete(`/users/${id}`);
  return id;
};

// Update User
export const updateUserAPI = async (user) => {
  const response = await api.put(`/users/${user.id}`, user);
  return response.data;
};
