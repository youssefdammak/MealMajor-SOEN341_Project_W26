import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecipeFilterUI from "../components/RecipeFilterUI";

describe("RecipeFilterUI", () => {
  test("should render all filter sections", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    expect(screen.getByText(/Preparation Time/i)).toBeInTheDocument();
    expect(screen.getByText(/Difficulty/i)).toBeInTheDocument();
    expect(screen.getByText(/Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Dietary Tags/i)).toBeInTheDocument();
  });

  test("should render all preparation time options", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    const prepTimeSelect = screen.getAllByDisplayValue("Any")[0];
    expect(prepTimeSelect).toBeInTheDocument();
    expect(screen.getByText(/Less than 30 mins/i)).toBeInTheDocument();
    expect(screen.getByText(/Less than 1 hour/i)).toBeInTheDocument();
    expect(screen.getByText(/More than 1 hour/i)).toBeInTheDocument();
  });

  test("should render all difficulty options", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    expect(screen.getByText("Easy")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Hard")).toBeInTheDocument();
  });

  test("should render all cost options", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    expect(screen.getByText(/Under \$10/i)).toBeInTheDocument();
    expect(screen.getByText(/Under \$20/i)).toBeInTheDocument();
    expect(screen.getByText(/Under \$30/i)).toBeInTheDocument();
  });

  test("should render all dietary tag checkboxes", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    expect(screen.getByLabelText(/Vegan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gluten-Free/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/High-Protein/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Vegetarian/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dairy-Free/i)).toBeInTheDocument();
  });

  test("should call setPrepTime when preparation time option changes", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    const prepTimeSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(prepTimeSelect, { target: { value: "lt30" } });

    expect(mockSetters.setPrepTime).toHaveBeenCalledWith("lt30");
  });

  test("should call setDifficulty when difficulty option changes", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    const difficultySelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(difficultySelect, { target: { value: "Easy" } });

    expect(mockSetters.setDifficulty).toHaveBeenCalledWith("Easy");
  });

  test("should call setCost when cost option changes", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    const costSelect = screen.getAllByRole("combobox")[2];
    fireEvent.change(costSelect, { target: { value: "under10" } });

    expect(mockSetters.setCost).toHaveBeenCalledWith("under10");
  });

  test("should call handleDietaryTagChange when checkbox is clicked", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    const veganCheckbox = screen.getByLabelText(/Vegan/i);
    fireEvent.click(veganCheckbox);

    expect(mockSetters.setDietaryTags).toHaveBeenCalled();
  });

  test("should call handleReset when Clear Filters button is clicked", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: [],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    const clearButton = screen.getByRole("button", { name: /Clear Filters/i });
    fireEvent.click(clearButton);

    expect(mockSetters.handleReset).toHaveBeenCalled();
  });

  test("should display checked dietary tags when selected", () => {
    const mockSetters = {
      prepTime: "",
      setPrepTime: jest.fn(),
      difficulty: "",
      setDifficulty: jest.fn(),
      cost: 0,
      setCost: jest.fn(),
      dietaryTags: ["Vegan", "Gluten-Free"],
      setDietaryTags: jest.fn(),
      handleReset: jest.fn(),
    };

    render(<RecipeFilterUI {...mockSetters} />);

    const veganCheckbox = screen.getByLabelText(/Vegan/i);
    const glutenCheckbox = screen.getByLabelText(/Gluten-Free/i);

    expect(veganCheckbox.checked).toBe(true);
    expect(glutenCheckbox.checked).toBe(true);
  });
});
