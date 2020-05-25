import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function HomePage() {
    return (
        <div className="homepage-container min-h-screen flex justify-center items-center p-10">
            <div className="text-black flex justify-center items-center flex-col">
                <h1 className="text-4xl font-bold font-is-playfair">It's Cook-able</h1>
                <p className="mb-6 text-gray-800 text-center">Find delicious recipes with popular ingredients</p>
                <Link to="/categories"
                    className="px-4 py-4 bg-red-600 rounded-full uppercase w-full text-white text-center">
                    Get  Started
             </Link>
            </div>
        </div>
    );
}

export default HomePage;
