import React, { useState } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const SearchByLink = () => {
  const [channelLink, setChannelLink] = useState('');
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setChannelLink(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call a function to fetch data from the YouTube API using the channel link
    console.log(extractChannelUsername(channelLink))
    fetchData(channelLink);
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
    <div>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Enter YouTube channel link"
                value={channelLink}
                onChange={handleChange}
            />
            <button type="submit">Search</button>
        </form>
        {error && <div>Error: {error}</div>}
        {channelData && channelData.items && channelData.items.length > 0 && (
          <div>
            <h2>Channel Data</h2>
            <p>Title: {channelData.items[0].snippet.title}</p>
            <p>Description: {channelData.items[0].snippet.description}</p>
            <p>View Count: {channelData.items[0].statistics.viewCount}</p>
            <p>Subscriber Count: {channelData.items[0].statistics.subscriberCount}</p>
            {/* Add more statistics and snippet data here as needed */}
          </div>
        )}
    </div>
  );
};

export default SearchByLink;
