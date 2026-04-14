import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "../components/SignUpForm";
import * as authService from "../services/authService";

jest.mock("../services/authService");

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render signup form with all input fields", () => {
    render(<SignupForm />);

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    expect(passwordInputs.length).toBeGreaterThanOrEqual(2);
  });

  test("should render Sign Up heading", () => {
    render(<SignupForm />);

    expect(screen.getByText("Sign Up!")).toBeInTheDocument();
  });

  test("should render Create Account button", () => {
    render(<SignupForm />);

    expect(screen.getByRole("button", { name: /Create Account/i })).toBeInTheDocument();
  });

  test("should update input values as user types", () => {
    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInputs = screen.getAllByPlaceholderText(/^Password$/i);
    const passwordInput = passwordInputs[0];

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(usernameInput.value).toBe("testuser");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("should display error when password is less than 6 characters", async () => {
    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    const passwordInput = passwordInputs[0];
    const retypePasswordInput = passwordInputs[1];
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass" } });
    fireEvent.change(retypePasswordInput, { target: { value: "pass" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test("should display error when passwords do not match", async () => {
    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    const passwordInput = passwordInputs[0];
    const retypePasswordInput = passwordInputs[1];
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(retypePasswordInput, { target: { value: "password456" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  test("should call signup service when form is submitted with valid data", async () => {
    authService.signup.mockResolvedValue({});

    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const retypePasswordInput = screen.getByPlaceholderText(/Retype Password/i);
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(retypePasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith("test@example.com", "password123", "testuser");
    });
  });

  test("should display success message on successful signup", async () => {
    authService.signup.mockResolvedValue({});

    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const retypePasswordInput = screen.getByPlaceholderText(/Retype Password/i);
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(retypePasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument();
    });
  });

  test("should display error message on signup failure", async () => {
    authService.signup.mockRejectedValue(new Error("Email already exists"));

    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const retypePasswordInput = screen.getByPlaceholderText(/Retype Password/i);
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(retypePasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Signup failed.*Email already exists/i)).toBeInTheDocument();
    });
  });

  test("should prevent default form submission", () => {
    render(<SignupForm />);

    const form = screen.getByRole("button", { name: /Create Account/i }).closest("form");
    const submitEvent = new Event("submit", { bubbles: true });
    const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

    form.dispatchEvent(submitEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test("should clear error and success messages on new submission", async () => {
    authService.signup.mockRejectedValueOnce(new Error("Error 1"));
    authService.signup.mockResolvedValueOnce({});

    render(<SignupForm />);

    const usernameInput = screen.getByPlaceholderText(/Username/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/^Password$/i);
    const retypePasswordInput = screen.getByPlaceholderText(/Retype Password/i);
    const submitButton = screen.getByRole("button", { name: /Create Account/i });

    // First submission - error
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(retypePasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Signup failed/i)).toBeInTheDocument();
    });

    // Clear and resubmit
    fireEvent.change(usernameInput, { target: { value: "testuser2" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument();
    });
  });
});
