import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useHistory
} from "react-router-dom";

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

function CategoriesPage() {
    let history = useHistory();

    const [categories, setCategories] = useState([]);

    useEffect(() => {

        async function getCategories() {
            const resp = await fetch(`${API_BASE_URL}categories.php`);
            const data = await resp.json();
            setCategories(data.categories)
        }

        getCategories();

    }, []);

    return (
        <div className="min-h-screen py-5 xl:flex xl:justify-center">
            <div className="max-w-screen-xl">
                <div className="px-5 mb-2">
                    <h1 className="text-5xl font-bold font-is-playfair">Categories</h1>
                    <p className="mt-0 text-gray-800">Select Category</p>
                </div>

                <div className="flex overflow-y-auto md:flex-wrap md:justify-center md:items-center mb-2 py-2 ">
                    {categories.map(function ({
                        strCategory,
                        strCategoryDescription,
                        strCategoryThumb
                    }) {

                        return (
                            <Link key={strCategory} to={`/recipes?category=${strCategory.toLowerCase()}`} className="category-card block md:w-3/12 md:m-2">
                                <div className="p-4">
                                    <h1 className="truncate text-5xl text-red-600 font-bold font-is-playfair">{strCategory}</h1>
                                    <p className="truncate">{strCategoryDescription}</p>
                                </div>
                                <div className="aspect-16-9 bg-cover bg-center" style={{ backgroundImage: `url(${strCategoryThumb})` }}>

                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="px-5">
                    <Link to="/" className="px-4 py-4 bg-red-600 mb-2 rounded-full uppercase w-full text-white text-center block">
                        Home
                </Link>
                    <button onClick={() => { history.goBack() }} className="px-4 py-4 rounded-full uppercase w-full text-red-600 border border-red-600 text-center block">
                        Back
                </button>
                </div>
            </div>


        </div>
    );
}

export default CategoriesPage;
