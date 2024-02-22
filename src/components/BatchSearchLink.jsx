import React, { useState } from 'react';
import axios from 'axios';
import '../styles/BatchSearchLink.css'; // Import the CSS file for styling

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const BatchSearchLink = () => {
  const [channelLinks, setChannelLinks] = useState('');
  const [channelDataList, setChannelDataList] = useState([]);
  const [errorQueries, setErrorQueries] = useState([]);

  const handleChange = (event) => {
    setChannelLinks(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Split the input into individual channel links
    const linksArray = channelLinks.split('\n').filter(link => link.trim() !== '');
    // Call a function to fetch data from the YouTube API for each channel link
    await fetchBatchData(linksArray);
  };

  const fetchBatchData = async (linksArray) => {
    try {
      // Array to store promises for each API call
      const promises = linksArray.map(link => fetchData(link));
      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      setChannelDataList(results);
      setErrorQueries([]); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorQueries(linksArray.map(query => ({ error, query }))); // Store errors for each query
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
        return { query: channelLink }; // Return the query along with null data
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
    <div className="batch-search-link-container"> {/* Apply styling class */}
        <h2>Batch Search by Search Link</h2>
        <form onSubmit={handleSubmit}>
            <textarea
                placeholder="Enter YouTube channel links (one link per line)"
                value={channelLinks}
                onChange={handleChange}
            />
            <button type="submit">Search</button>
        </form>
        {errorQueries.length > 0 && (
          <div className="error-container"> {/* Apply styling class */}
            <h2>Error</h2>
            {errorQueries.map(({ error, query }, index) => (
              <p key={index}>Failed to fetch data for: {query}. Reason: {error.message}</p>
            ))}
          </div>
        )}
        {channelDataList.map((channelData, index) => (
          <div key={index} className="channel-data"> {/* Apply styling class */}
            {channelData && channelData.items && channelData.items.length > 0 ? (
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
            ) : (
              <div>No channel found for: {channelData ? channelData.query : 'unknown'}</div>
            )}
          </div>
        ))}
    </div>
  );
};

export default BatchSearchLink;
