import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SearchForm.css'; // Import the CSS file for styling

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const Search = () => {
  const [query, setQuery] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call a function to fetch data from the YouTube API using the query
    await fetchData(query);
  };

  const fetchData = async (query) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet,contentDetails,statistics',
          forUsername: query,
          key: apiKey
        }
      });
      console.log(response.data);
      if (response.data.items && response.data.items.length > 0) {
        // If items exist in the response, set the channel data
        setChannelData(response.data);
        setError(null); // Clear any previous errors
      } else {
        // If no items are found, set an error message
        setError('No channel found');
        setChannelData(null); // Clear any previous channel data
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setChannelData(null);
      // Handle errors here
    }
  };

  return (
    <div className="search-form-container"> {/* Apply styling class */}
        <h2>Search by Channel Name</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter YouTube username or channel link"
                value={query}
                onChange={handleChange}
            />
            <button type="submit">Search</button>
        </form>
        {/* {apiKey} */}

        {error && <div className="error">Error: {error}</div>}
        {channelData && channelData.items && channelData.items.length > 0 && (
          <div>
            <h2>Channel Data</h2>
            <p>Title: {channelData.items[0].snippet.title}</p>
            <img src={channelData.items[0].snippet.thumbnails.medium.url} alt="Channel Thumbnail Access Failed" />
            <p>Description: {channelData.items[0].snippet.description}</p>
            <p>View Count: {channelData.items[0].statistics.viewCount}</p>
            <p>Video Count: {channelData.items[0].statistics.videoCount}</p>
            <p>Subscriber Count: {channelData.items[0].statistics.subscriberCount}</p>
            {channelData.items[0].statistics.videoCount !== 0 ? (
              <p>Views per Video Count: {Math.ceil(channelData.items[0].statistics.viewCount / channelData.items[0].statistics.videoCount)}</p>
              ) : (
              <p>Views per Video Count: N/A (video count is zero)</p>
            )}

            {/* Add more statistics and snippet data here as needed */}
          </div>
        )}
    </div>
  );
};

export default Search;
