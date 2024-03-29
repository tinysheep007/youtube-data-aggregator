import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SearchByLink.css'; // Import the CSS file for styling

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const SearchByLink = () => {
  const [channelLink, setChannelLink] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setChannelLink(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call a function to fetch data from the YouTube API using the channel link
    await fetchData(channelLink);
  };

  const fetchData = async (channelLink) => {
    try {
      // Extract channel username from the link
      const channelUsername = extractChannelUsername(channelLink);
      
      // Fetch channel data using the username
      const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'snippet,statistics',
          forUsername: channelUsername,
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

  // Function to extract channel username from the channel link
  const extractChannelUsername = (link) => {
    // Extract username from different types of channel links
    const channelLinkRegex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/)?([^\/\?]+)/;
    const match = link.match(channelLinkRegex);
    if (match && match[1]) {
        const username = match[1].replace('@', '');
        return username;
    } else {
      return null;
    }
  };

  return (
    <div className="search-by-link-container"> {/* Apply styling class */}
        <h2>Search by Channel Link</h2>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter YouTube channel link"
                value={channelLink}
                onChange={handleChange}
            />
            <button type="submit">Search</button>
        </form>
        {error && <div className="error">Error: {error}</div>}
        {channelData && channelData.items && channelData.items.length > 0 && (
          <div>
            <h2>Channel Data</h2>
            <img src={channelData.items[0].snippet.thumbnails.medium.url} alt="Channel Thumbnail Access Failed" />
            <p>Title: {channelData.items[0].snippet.title}</p>
            <p>Description: {channelData.items[0].snippet.description}</p>
            <p>View Count: {channelData.items[0].statistics.viewCount}</p>
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

export default SearchByLink;
