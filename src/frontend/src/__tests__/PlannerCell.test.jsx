import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlannerCell from "../components/PlannerCell";

describe("PlannerCell", () => {
  test("should render Add meal button when no meal is provided", () => {
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <PlannerCell
        meal={null}
        day="Monday"
        mealType="breakfast"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole("button", { name: /Add meal/i })).toBeInTheDocument();
  });

  test("should render meal name when meal is provided", () => {
    const mockMeal = { name: "Pancakes" };
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <PlannerCell
        meal={mockMeal}
        day="Monday"
        mealType="breakfast"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Pancakes")).toBeInTheDocument();
  });

  test("should render Edit and Delete buttons when meal is provided", () => {
    const mockMeal = { name: "Oatmeal" };
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <PlannerCell
        meal={mockMeal}
        day="Tuesday"
        mealType="lunch"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByRole("button", { name: /Edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

  test("should call onAdd with day and mealType when Add meal button is clicked", () => {
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <PlannerCell
        meal={null}
        day="Wednesday"
        mealType="dinner"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const addButton = screen.getByRole("button", { name: /Add meal/i });
    fireEvent.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledWith("Wednesday", "dinner");
  });

  test("should call onEdit with day and mealType when Edit button is clicked", () => {
    const mockMeal = { name: "Salad" };
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <PlannerCell
        meal={mockMeal}
        day="Thursday"
        mealType="lunch"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByRole("button", { name: /Edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith("Thursday", "lunch");
  });

  test("should call onDelete with day and mealType when Delete button is clicked", () => {
    const mockMeal = { name: "Steak" };
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    render(
      <PlannerCell
        meal={mockMeal}
        day="Friday"
        mealType="dinner"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("Friday", "dinner");
  });

  test("should have planner_cell class on container", () => {
    const mockOnAdd = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    const { container } = render(
      <PlannerCell
        meal={null}
        day="Saturday"
        mealType="breakfast"
        onAdd={mockOnAdd}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(container.querySelector(".planner_cell")).toBeInTheDocument();
  });
});
