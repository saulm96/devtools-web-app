import { Request, Response } from "express";
import { User, CreateUserData } from "../models/User";
import { generateAccesToken, generateRefreshToken } from "../utils/jwt";

interface LoginRequest {
  identifier: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: Omit<User, "password">;
}

interface RegisterRequest extends CreateUserData {}

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: Omit<User, "password">;
}

// Helper function to set JWT cookies
const setJWTCookies = (res: Response, user: User): void => {
  const tokenPayload = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
  };

  const accessToken = generateAccesToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.authenticateUser({ identifier, password });

    // Set JWT cookies
    setJWTCookies(res, user);

    const response: LoginResponse = {
      success: true,
      message: "Login successful",
      user: user.toJSON(),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);

    // Handle authentication errors specifically
    if (
      error instanceof Error &&
      (error.message === "Invalid credentials" ||
        error.message === "Email/username and password are required")
    ) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const userData: RegisterRequest = req.body;
    
    // Create new user using model method
    const newUser = await User.createUser(userData);

    // Auto-login: Set JWT cookies
    setJWTCookies(res, newUser);

    const response: RegisterResponse = {
      success: true,
      message: "User registered and logged in successfully",
      user: newUser.toJSON(),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle validation errors specifically
    if (error instanceof Error && 
        (error.message.includes("already exists") || 
         error.message.includes("are required") ||
         error.message.includes("validation"))) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Logout function to clear cookies
export const logout = (req: Request, res: Response): void => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  res.status(200).json({
    success: true,
    message: "Logout successful"
  });
};

export default { login, logout, register };