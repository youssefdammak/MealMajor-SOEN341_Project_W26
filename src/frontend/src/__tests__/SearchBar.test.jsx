import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  test("should render search input with default placeholder", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search by name or ingredient/i);
    expect(input).toBeInTheDocument();
  });

  test("should render search input with custom placeholder", () => {
    const mockOnSearch = jest.fn();
    const customPlaceholder = "Find your recipe...";
    render(
      <SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />
    );

    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });

  test("should render Search and Clear buttons", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Clear/i })).toBeInTheDocument();
  });

  test("should call onSearch when user types", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search by name or ingredient/i);
    fireEvent.change(input, { target: { value: "pasta" } });

    expect(mockOnSearch).toHaveBeenCalledWith("pasta");
  });

  test("should call onSearch when Search button is clicked", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search by name or ingredient/i);
    const searchButton = screen.getByRole("button", { name: /Search/i });

    fireEvent.change(input, { target: { value: "pizza" } });
    fireEvent.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith("pizza");
  });

  test("should clear input and call onSearch with empty string when Clear button is clicked", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search by name or ingredient/i);
    const clearButton = screen.getByRole("button", { name: /Clear/i });

    fireEvent.change(input, { target: { value: "curry" } });
    fireEvent.click(clearButton);

    expect(input.value).toBe("");
    expect(mockOnSearch).toHaveBeenCalledWith("");
  });

  test("should prevent default form submission", () => {
    const mockOnSearch = jest.fn();
    const { container } = render(<SearchBar onSearch={mockOnSearch} />);

    const form = container.querySelector(".searchbar-form");
    const submitEvent = new Event("submit", { bubbles: true });
    const preventDefaultSpy = jest.spyOn(submitEvent, "preventDefault");

    form.dispatchEvent(submitEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  test("should update input value as user types", () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search by name or ingredient/i);

    fireEvent.change(input, { target: { value: "a" } });
    expect(input.value).toBe("a");

    fireEvent.change(input, { target: { value: "ap" } });
    expect(input.value).toBe("ap");

    fireEvent.change(input, { target: { value: "apple" } });
    expect(input.value).toBe("apple");
  });
});
