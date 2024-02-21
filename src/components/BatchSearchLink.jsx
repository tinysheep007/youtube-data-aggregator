import React, { useState } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const BatchSearchLink = () => {
  const [channelLinks, setChannelLinks] = useState('');
  const [channelDataList, setChannelDataList] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setChannelLinks(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Split the input into individual channel links
    const linksArray = channelLinks.split('\n').filter(link => link.trim() !== '');
    // Call a function to fetch data from the YouTube API for each channel link
    fetchBatchData(linksArray);
  };

  const fetchBatchData = async (linksArray) => {
    try {
      // Array to store promises for each API call
      const promises = linksArray.map(link => fetchData(link));
      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      setChannelDataList(results);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setChannelDataList([]); // Clear any previous channel data
      // Handle errors here
    }
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
        // If items exist in the response, return the channel data
        return response.data;
      } else {
        // If no items are found, return null
        return null;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Throw the error to be caught by fetchBatchData
      throw error;
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
            <textarea
                placeholder="Enter YouTube channel links (one link per line)"
                value={channelLinks}
                onChange={handleChange}
            />
            <button type="submit">Search</button>
        </form>
        {error && <div>Error: {error}</div>}
        {channelDataList.map((channelData, index) => (
          <div key={index}>
            {channelData && channelData.items && channelData.items.length > 0 ? (
              <div>
                <h2>Channel Data</h2>
                <p>Title: {channelData.items[0].snippet.title}</p>
                <p>Description: {channelData.items[0].snippet.description}</p>
                <p>View Count: {channelData.items[0].statistics.viewCount}</p>
                <p>Subscriber Count: {channelData.items[0].statistics.subscriberCount}</p>
                {/* Add more statistics and snippet data here as needed */}
              </div>
            ) : (
              <div>No channel found for this link</div>
            )}
          </div>
        ))}
    </div>
  );
};

export default BatchSearchLink;
