import React, { useState } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call a function to fetch data from the YouTube API using the query
    fetchData(query);
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
    <div>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter YouTube username or channel link"
                value={query}
                onChange={handleChange}
            />
            <button type="submit">Search</button>
        </form>
        {apiKey}

        {error && <div>Error: {error}</div>}
        {channelData && channelData.items && channelData.items.length > 0 && (
          <div>
            <h2>Channel Data</h2>
            <p>Title: {channelData.items[0].snippet.title}</p>
            <p>Description: {channelData.items[0].snippet.description}</p>
            <p>View Count: {channelData.items[0].statistics.viewCount}</p>
            <p>Video Count: {channelData.items[0].statistics.videoCount}</p>
            <p>Subscriber Count: {channelData.items[0].statistics.subscriberCount}</p>
            {/* Add more statistics and snippet data here as needed */}
          </div>
        )}
    </div>
  );
};

export default SearchForm;
