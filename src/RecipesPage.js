import React, { useEffect, useState } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    useHistory
} from "react-router-dom";
import queryString from 'query-string';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

function RecipesPage() {
    const [recipes, setRecipes] = useState([]);
    let history = useHistory();
    let location = useLocation();

    const { category } = queryString.parse(location.search);

    const params = queryString.stringify({
        c: category
    })

    useEffect(() => {

        async function getRecipes() {
            const resp = await fetch(`${API_BASE_URL}filter.php?${params}`);
            const data = await resp.json();
            setRecipes(data.meals)
        }

        getRecipes();

    }, []);

    return (
        <div className="min-h-screen py-5">

            <div className="px-5 mb-2">
                <h1 className="text-5xl font-bold font-is-playfair">Recipes</h1>
                <p className="mt-0 text-gray-800 capitalize">{category} Recipes</p>
            </div>

            <div className="flex overflow-y-auto mb-2 py-2">
                {recipes.map(function ({
                    idMeal,
                    strMeal,
                    strMealThumb
                }) {

                    return (
                        <Link key={idMeal} to={`/recipe/${idMeal}`} style={{ backgroundImage: `url(${strMealThumb})` }} className="recipe-card block relative rounded-md">
                            <h1 className="bg-white absolute bottom-0 left-0 p-2 w-full truncate text-1xl text-red-600 rounded-b-md font-bold font-is-playfair">{strMeal}</h1>
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
    );
}

export default RecipesPage;
