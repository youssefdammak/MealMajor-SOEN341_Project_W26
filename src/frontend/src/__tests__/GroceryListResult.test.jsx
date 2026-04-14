import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GroceryListResult from "../components/GroceryListResult";

describe("GroceryListResult", () => {
  test("should display no ingredients message when array is empty", () => {
    const mockOnBought = jest.fn();
    render(<GroceryListResult groceryItems={[]} onBought={mockOnBought} />);

    expect(
      screen.getByText(/No missing ingredients found/i)
    ).toBeInTheDocument();
  });

  test("should display no ingredients message when groceryItems is null", () => {
    const mockOnBought = jest.fn();
    render(<GroceryListResult groceryItems={null} onBought={mockOnBought} />);

    expect(
      screen.getByText(/No missing ingredients found/i)
    ).toBeInTheDocument();
  });

  test("should display grocery items with their details", () => {
    const mockOnBought = jest.fn();
    const groceryItems = [
      {
        name: "Eggs",
        storeName: "Metro",
        price: "$3.99",
        link: "https://www.metro.ca/flyer",
      },
      {
        name: "Milk",
        storeName: "IGA",
        price: "$4.50",
        link: "https://www.iga.net/flyer",
      },
    ];

    render(
      <GroceryListResult groceryItems={groceryItems} onBought={mockOnBought} />
    );

    expect(screen.getByText("Eggs")).toBeInTheDocument();
    expect(screen.getByText("Milk")).toBeInTheDocument();
    expect(screen.getByText("Metro")).toBeInTheDocument();
    expect(screen.getByText("IGA")).toBeInTheDocument();
    expect(screen.getByText("$3.99")).toBeInTheDocument();
    expect(screen.getByText("$4.50")).toBeInTheDocument();
  });

  test("should display N/A when storeName is missing", () => {
    const mockOnBought = jest.fn();
    const groceryItems = [
      {
        name: "Bread",
        storeName: "",
        price: "$2.50",
        link: "https://example.com",
      },
    ];

    render(
      <GroceryListResult groceryItems={groceryItems} onBought={mockOnBought} />
    );

    const stores = screen.getAllByText("N/A");
    expect(stores.length > 0).toBe(true);
  });

  test("should display View Product link", () => {
    const mockOnBought = jest.fn();
    const groceryItems = [
      {
        name: "Butter",
        storeName: "Maxi",
        price: "$5.99",
        link: "https://www.maxi.ca/flyer",
      },
    ];

    render(
      <GroceryListResult groceryItems={groceryItems} onBought={mockOnBought} />
    );

    const link = screen.getByRole("link", { name: /View Product/i });
    expect(link).toHaveAttribute("href", "https://www.maxi.ca/flyer");
    expect(link).toHaveAttribute("target", "_blank");
  });

  test("should call onBought when Bought button is clicked", () => {
    const mockOnBought = jest.fn();
    const groceryItems = [
      {
        name: "Cheese",
        storeName: "Provigo",
        price: "$6.99",
        link: "https://www.provigo.ca/flyer",
      },
    ];

    render(
      <GroceryListResult groceryItems={groceryItems} onBought={mockOnBought} />
    );

    const boughtButtons = screen.getAllByRole("button", { name: /Bought/i });
    const boughtButton = boughtButtons[0];
    fireEvent.click(boughtButton);

    expect(mockOnBought).toHaveBeenCalledWith(groceryItems[0]);
  });

  test("should display Missing Ingredients title when items exist", () => {
    const mockOnBought = jest.fn();
    const groceryItems = [
      {
        name: "Flour",
        storeName: "Super C",
        price: "$3.50",
        link: "https://www.superc.ca/flyer",
      },
    ];

    render(
      <GroceryListResult groceryItems={groceryItems} onBought={mockOnBought} />
    );

    expect(screen.getByText("Missing Ingredients")).toBeInTheDocument();
  });

  test("should display Grocery List title when no items", () => {
    const mockOnBought = jest.fn();

    render(<GroceryListResult groceryItems={[]} onBought={mockOnBought} />);

    expect(screen.getByText("Grocery List")).toBeInTheDocument();
  });

  test("should handle multiple grocery items with all fields", () => {
    const mockOnBought = jest.fn();
    const groceryItems = [
      {
        name: "Item 1",
        storeName: "Store 1",
        price: "$1.00",
        link: "https://store1.com",
      },
      {
        name: "Item 2",
        storeName: "Store 2",
        price: "$2.00",
        link: "https://store2.com",
      },
      {
        name: "Item 3",
        storeName: "Store 3",
        price: "$3.00",
        link: "https://store3.com",
      },
    ];

    render(
      <GroceryListResult groceryItems={groceryItems} onBought={mockOnBought} />
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });
});
