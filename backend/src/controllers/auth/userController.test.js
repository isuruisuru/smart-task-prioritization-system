import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import * as userController from "./userController.js";
import User from "../../models/auth/UserModel.js";
import generateToken from "../../helpers/generateToken.js";
import bcryptjs from "bcryptjs";

// Mock helpers (ESM style)
jest.mock("../../helpers/generateToken.js", () => {
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue("mocktoken"), // Mock the function directly
  };
});

jest.mock("bcryptjs", () => ({
  __esModule: true,
  compare: jest.fn().mockImplementation((password, hash) => {
    return Promise.resolve(password === "123456"); // Mock the function directly
  }),
  hash: jest.fn(() => Promise.resolve("hashed")),
}));

jest.mock("../../helpers/sendEmail.js", () => ({
  __esModule: true,
  default: jest.fn()
}));

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post("/register", userController.registerUser);
app.post("/login", userController.loginUser);
app.post("/logout", userController.logoutUser);
app.get("/user", (req, res, next) => {
  req.user = { _id: "mockUserId" };
  next();
}, userController.getUser);
app.put("/user", (req, res, next) => {
  req.user = { _id: "mockUserId" };
  next();
}, userController.updateUser);

describe("User Controller", () => {
  let findOneSpy, createSpy, findByIdSpy;

  beforeEach(() => {
    findOneSpy = jest.spyOn(User, "findOne");
    createSpy = jest.spyOn(User, "create");
    findByIdSpy = jest.spyOn(User, "findById");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should reject if any field is missing", async () => {
      const res = await request(app).post("/register").send({ email: "a@a.com", password: "123456" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("All fields are required");
    });

    it("should reject if password too short", async () => {
      const res = await request(app).post("/register").send({ name: "Test", email: "a@a.com", password: "123" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Password must be at least 6 characters");
    });

    it("should reject if user already exists", async () => {
      findOneSpy.mockResolvedValue({ email: "a@a.com" });
      const res = await request(app).post("/register").send({ name: "Test", email: "a@a.com", password: "123456" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });

    it("should register a new user", async () => {
      findOneSpy.mockResolvedValue(null);
      createSpy.mockResolvedValue({
        _id: "mockid",
        name: "Test",
        email: "a@a.com",
        role: "user",
        photo: null,
        bio: "",
        isVerified: false,
      });
      const res = await request(app).post("/register").send({ name: "Test", email: "a@a.com", password: "123456" });
      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe("Test");
      expect(res.body.token).toBe("mocktoken");
      expect(res.headers["set-cookie"][0]).toContain("token=mocktoken");
    });
  });

  describe("loginUser", () => {
    it("should reject if fields are missing", async () => {
      const res = await request(app).post("/login").send({ email: "a@a.com" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("All fields are required");
    });

    it("should reject if user not found", async () => {
      findOneSpy.mockResolvedValue(null);
      const res = await request(app).post("/login").send({ email: "a@a.com", password: "123456" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found, sign up!");
    });

    it("should reject if password does not match", async () => {
      findOneSpy.mockResolvedValue({ email: "a@a.com", password: "hashed" });
      const res = await request(app).post("/login").send({ email: "a@a.com", password: "wrongpassword" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid credentials");
    });

    it("should login the user", async () => {
      const fakeUser = {
        _id: "mockid",
        name: "Test",
        email: "a@a.com",
        role: "user",
        photo: null,
        bio: "",
        isVerified: false,
        password: "hashed",
      };
      findOneSpy.mockResolvedValue(fakeUser);
      const res = await request(app).post("/login").send({ email: "a@a.com", password: "123456" });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Test");
      expect(res.body.token).toBe("mocktoken");
      expect(res.headers["set-cookie"][0]).toContain("token=mocktoken");
    });
  });

  describe("logoutUser", () => {
    it("should clear the token cookie", async () => {
      const res = await request(app).post("/logout");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("User logged out");
      expect(res.headers["set-cookie"][0]).toContain("token=;"); // cookie cleared
    });
  });

  describe("getUser", () => {
    it("should return user details if found", async () => {
      findByIdSpy.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: "mockUserId", name: "Test", email: "a@a.com" }),
      });
      const res = await request(app).get("/user");
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Test");
    });

    it("should return 404 if user not found", async () => {
      findByIdSpy.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });
      const res = await request(app).get("/user");
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      const saveMock = jest.fn().mockResolvedValue({
        _id: "mockUserId",
        name: "Updated",
        email: "a@a.com",
        role: "user",
        photo: "photo.png",
        bio: "bio",
        isVerified: false,
      });
      findByIdSpy.mockResolvedValue({
        name: "Old",
        email: "a@a.com",
        role: "user",
        photo: "",
        bio: "",
        save: saveMock,
      });
      const res = await request(app).put("/user").send({ name: "Updated", photo: "photo.png", bio: "bio" });
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("Updated");
    });

    it("should return 404 if user not found", async () => {
      findByIdSpy.mockResolvedValue(null);
      const res = await request(app).put("/user").send({ name: "Updated" });
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });
});