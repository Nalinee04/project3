// app/admin/addproduct/page.tsx

import { useState } from 'react';

const AddProductPage = () => {
    // States for product and category
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Fetch categories from API
    const fetchCategories = async () => {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
    };

    // Handle adding a new product
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            name: productName,
            description,
            price,
            category_id: categoryId,
        };
        
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            alert('Product added successfully!');
            // Reset form or fetch updated product list if needed
        } else {
            alert('Failed to add product');
        }
    };

    // Handle adding a new category
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const categoryData = { name: newCategoryName };
        
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData),
        });

        if (response.ok) {
            alert('Category added successfully!');
            fetchCategories(); // Refresh the category list
        } else {
            alert('Failed to add category');
        }
    };

    // Fetch categories when the component loads
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <h1>Add New Product</h1>
            <form onSubmit={handleAddProduct}>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Add Product</button>
            </form>

            <h1>Add New Category</h1>
            <form onSubmit={handleAddCategory}>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                />
                <button type="submit">Add Category</button>
            </form>
        </div>
    );
};

export default AddProductPage;
