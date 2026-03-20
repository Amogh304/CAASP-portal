import { useState, useEffect, useCallback } from "react";
import { User, LoginRequest } from "@workspace/api-client-react";

// Mocking actual API calls with local state for the POC to ensure reliability 
// even if backend endpoints aren't fully wired up yet.
const MOCK_USERS: Record<string, User> = {
  "student1": { id: "u1", username: "student1", name: "Alex Student", email: "alex@school.edu", role: "student", grade: "8", classIds: ["c1"], createdAt: new Date().toISOString() },
  "teacher1": { id: "u2", username: "teacher1", name: "Sarah Jenkins", email: "sarah.j@school.edu", role: "teacher", createdAt: new Date().toISOString() },
  "admin1": { id: "u3", username: "admin1", name: "Dr. Admin", email: "admin@school.edu", role: "admin", createdAt: new Date().toISOString() }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("caaspp_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = MOCK_USERS[credentials.username];
    if (mockUser && credentials.password === "demo123") {
      localStorage.setItem("caaspp_user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsLoading(false);
      return mockUser;
    }
    
    setIsLoading(false);
    throw new Error("Invalid username or password");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("caaspp_user");
    setUser(null);
    window.location.href = "/";
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };
}
