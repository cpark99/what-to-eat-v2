import React, { useEffect, useState } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useHistory
} from "react-router-dom";
import queryString from 'query-string';

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';

function RecipePage() {
    const [recipe, setRecipe] = useState(null);

    let { id } = useParams();
    let history = useHistory();

    useEffect(() => {

        async function getRecipe() {
            const resp = await fetch(`${API_BASE_URL}lookup.php?i=${id}`);
            const { meals } = await resp.json();
            const [recipe] = meals;

            var { query: { v: youtubeId } } = queryString.parseUrl(recipe.strYoutube);

            const ingredients = [];

            let i = 1;

            while (true) {
                if (recipe[`strIngredient${i}`]) {
                    ingredients.push({
                        ingredient: recipe[`strIngredient${i}`],
                        measurement: recipe[`strMeasure${i}`],
                    });
                    i++;

                } else {
                    break;
                }

            }

            setRecipe({
                ...recipe,
                youtubeId,
                ingredients
            })
        }
        getRecipe();

    }, []);



    return (
        <div className="min-h-screen">

            {recipe && (
                <>
                    <div className="aspect-16-9" style={{ backgroundImage: `url(${recipe.strMealThumb})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>

                    </div>

                    <div className="px-5 mb-2">
                        <h1 className="text-xl font-bold text-red-600 font-is-playfair capitalize my-5"> {recipe.strMeal} </h1>
                        <h1 className="font-bold mt-4">Ingredients</h1>
                        <ul>
                            {
                                recipe.ingredients.map(({ ingredient, measurement }) => {
                                    return (
                                        <li className="flex justify-between border-b border-dotted my-6 pb-2" key={ingredient + measurement}><span className="inline-block mr-10">{ingredient}</span> <span className="inline-block text-gray-500 text-right">{measurement}</span></li>
                                    );
                                })
                            }
                        </ul>

                        <h1 className="font-bold mt-4">Directions</h1>
                        <p>
                            {recipe.strInstructions}
                        </p>

                        <h1 className="font-bold mt-4">Video</h1>
                    </div>

                    <div className="aspect-16-9">
                        <iframe title="youtube embed" src={`https://www.youtube.com/embed/${recipe.youtubeId}`} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>

                </>
            )}

            <div className="px-5 my-4">
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

export default RecipePage;
