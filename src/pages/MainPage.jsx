import React from "react";
import "../styles/MainPageStyle.css"; // Import the CSS file for styling
const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const MainPage = () => {
    return (
        <div className="main-container"> {/* Apply styling class */}
            <h2>Welcome to the Home Page</h2>
            <div className="description">
                <p>Please use the header navigation bar according to your preference.</p>
            </div>
        </div>
    );
};

export default MainPage;
