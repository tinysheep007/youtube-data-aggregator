import React from "react";
import Search from "../components/Search";
const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;


const MainPage = () => {
    return (
        <div>
            main page
            <Search />
            {/* <Link to="/bs"/> */}
        </div>
    )
}

export default MainPage;