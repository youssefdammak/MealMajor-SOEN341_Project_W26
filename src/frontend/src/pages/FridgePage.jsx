// pages/FridgePage.jsx
import React, { useState } from 'react';

const UNIT_OPTIONS = [
    { value: 'units', label: 'Units' },
    { value: 'mililitres', label: 'ml' },
    { value: 'litres', label: 'L' },
    { value: 'grams', label: 'g' },
    { value: 'kilograms', label: 'kg' }
];

export default function Fridge() {
    const [ingredient, setIngredient] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('units');
    const [items, setItems] = useState([]);
    const [selected, setSelected] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editValues, setEditValues] = useState({ ingredient: '', quantity: '', unit: 'units' });

    const handleAdd = (e) => {
        e.preventDefault();
        if (!ingredient || !quantity) return;
        setItems([...items, { ingredient, quantity, unit }]);
        setIngredient('');
        setQuantity('');
        setUnit('units');
    };

    const handleRemove = (index) => {
        setItems(items.filter((_, i) => i !== index));
        setSelected(selected.filter(i => i !== index));
        if (editingIndex === index) setEditingIndex(null);
    };

    const handleSelect = (index) => {
        setSelected(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditValues({ ...items[index] });
    };

    const handleEditChange = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    const handleEditSave = (index) => {
        const updated = [...items];
        updated[index] = { ...editValues };
        setItems(updated);
        setEditingIndex(null);
    };

    const handleEditCancel = () => {
        setEditingIndex(null);
    };

    const getSelectedItems = () => selected.map(i => items[i]);

    return (
        <div className="fridgeForm">
            <h2>My Fridge</h2>
            <form onSubmit={handleAdd}>
                <input
                    type="text"
                    placeholder="Ingredient"
                    value={ingredient}
                    onChange={e => setIngredient(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    min="1"
                />
                <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                >
                    {UNIT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <button type="submit">Add</button>
            </form>
            <div className='fridgeListContainer'>
                <ul className='fridgeList'>
                    {items.map((item, idx) => (
                        <li key={idx}>
                            <input
                                type="checkbox"
                                checked={selected.includes(idx)}
                                onChange={() => handleSelect(idx)}
                                style={{ marginRight: '8px' }}
                            />
                            {editingIndex === idx ? (
                                <>
                                    <input
                                        type="text"
                                        value={editValues.ingredient}
                                        onChange={e => handleEditChange('ingredient', e.target.value)}
                                        style={{ maxWidth: '100px' }}
                                    />
                                    <input
                                        type="number"
                                        value={editValues.quantity}
                                        onChange={e => handleEditChange('quantity', e.target.value)}
                                        min="1"
                                        style={{ maxWidth: '75px' }}
                                    />
                                    <select
                                        value={editValues.unit}
                                        onChange={e => handleEditChange('unit', e.target.value)}
                                    >
                                        {UNIT_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <button onClick={() => handleEditSave(idx)} style={{ marginLeft: '8px' }}>Save</button>
                                    <button onClick={handleEditCancel}>Cancel</button>
                                    <button onClick={() => handleRemove(idx)}>Remove</button>
                                </>
                            ) : (
                                <>
                                    {item.ingredient} - {item.quantity} {item.unit}
                                    <button onClick={() => handleEdit(idx)}>Edit</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="actionButtons">
                {/* Need to add functionality to these buttons later*/}
                <button
                    onClick={() => alert('Search Recipes with selected items')}
                    disabled={selected.length === 0}
                >
                    Search Recipes
                </button>
                {/*Need to add functionality to these buttons later*/}
                <button
                    onClick={() => alert('Create Grocery List with selected items')}
                    disabled={selected.length === 0}
                >
                    Create Grocery List
                </button>
            </div>
        </div>
    );
}