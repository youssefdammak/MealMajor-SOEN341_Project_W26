import React from "react";

function PlannerCell({ meal, day, mealType, onAdd, onEdit, onDelete }) {
  return (
    <div className="planner_cell">
      {meal ? (
        <div className="planner_cell_content">
          <p>{meal.name}</p>
          <button className="blue_button" onClick={() => onEdit(day, mealType)}>
            Edit
          </button>
          <button
            className="red_button"
            onClick={() => onDelete(day, mealType)}
          >
            Delete
          </button>
        </div>
      ) : (
        <button className="blue_button" onClick={() => onAdd(day, mealType)}>
          Add meal
        </button>
      )}
    </div>
  );
}

export default PlannerCell;
