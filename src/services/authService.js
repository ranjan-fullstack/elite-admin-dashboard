export const loginAPI = async (email, password) => {
  const users = [
    { email: "admin@mail.com", password: "1234", role: "admin" },
    { email: "editor@mail.com", password: "1234", role: "editor" },
    { email: "viewer@mail.com", password: "1234", role: "viewer" },
  ];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const expiryTime =
    Math.floor(Date.now() / 1000) + 300;

  const accessToken = btoa(
    JSON.stringify({ exp: expiryTime })
  );

  return {
    user: {
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken: "refresh_token_456",
  };
};
