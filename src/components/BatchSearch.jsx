import React, { useState } from 'react';
import axios from 'axios';
import '../styles/BatchSearch.css'; // Import the CSS file for styling

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const BatchSearch = () => {
  const [queryList, setQueryList] = useState('');
  const [channelDataList, setChannelDataList] = useState([]);
  const [errorQueries, setErrorQueries] = useState([]);

  const handleChange = (event) => {
    setQueryList(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const queriesArray = queryList.split('\n').filter(query => query.trim() !== '');
    setErrorQueries([]); // Clear previous error queries

    try {
      const fetchDataPromises = queriesArray.map(query => fetchData(query.trim()));
      const channelDataResults = await Promise.all(fetchDataPromises);
      setChannelDataList(channelDataResults);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorQueries(prevErrorQueries => [...prevErrorQueries, error]); // Add error to the list
    }
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

      if (response.data.items && response.data.items.length > 0) {
        return response.data;
      } else {
        throw new Error(`No channel found for "${query}"`);
      }
    } catch (error) {
      return { error, query }; // Return error and query together
    }
  };

  return (
    <div className="batch-search-container"> {/* Apply styling class */}
      <h2>Batch Search by Names</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter YouTube usernames or channel links (one per line)"
          value={queryList}
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
      {channelDataList.map((channelData, index) => {
        return (
          <div key={index} className="channel-data-container"> {/* Apply styling class */}
            <h2>Channel Data {index + 1}</h2>
            {channelData.items && channelData.items.map((channel, idx) => (
              <div key={idx} className="channel-details"> {/* Apply styling class */}
                <p>Title: {channel.snippet.title}</p>
                <img src={channelData.items[0].snippet.thumbnails.medium.url} alt="Channel Thumbnail Access Failed" />
                <p>Description: {channel.snippet.description}</p>
                <p>View Count: {channel.statistics.viewCount}</p>
                <p>Video Count: {channel.statistics.videoCount}</p>
                <p>Subscriber Count: {channel.statistics.subscriberCount}</p>
                {channelData.items[0].statistics.videoCount !== 0 ? (
                  <p>Views per Video Count: {Math.ceil(channelData.items[0].statistics.viewCount / channelData.items[0].statistics.videoCount)}</p>
                  ) : (
                  <p>Views per Video Count: N/A (video count is zero)</p>
                )}
              </div>
            ))}
            {/* Display message for failed queries */}
            {channelData.error && (
              <div className="channel-details">
                <p>No channel found for: {channelData.query}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BatchSearch;
