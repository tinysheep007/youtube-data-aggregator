import React, { useState } from 'react';
import axios from 'axios';

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

const BatchSearch = () => {
  const [queryList, setQueryList] = useState('');
  const [channelDataList, setChannelDataList] = useState([]);
  const [errorMap, setErrorMap] = useState({});

  const handleChange = (event) => {
    setQueryList(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const queriesArray = queryList.split('\n').filter(query => query.trim() !== '');

    try {
      const fetchDataPromises = queriesArray.map(query => fetchData(query.trim()));
      const channelDataResults = await Promise.all(fetchDataPromises);
      setChannelDataList(channelDataResults);
      setErrorMap({}); // Clear error map on successful fetch
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorObject = {};
      queriesArray.forEach(query => errorObject[query] = error.message); // Store errors for each query
      setErrorMap(errorObject);
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
      throw error;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter YouTube usernames or channel links (one per line)"
          value={queryList}
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>
      {Object.keys(errorMap).map((query, index) => (
        <div key={index}>
          <h2>Error</h2>
          <p>Failed to fetch data for: {query}</p>
        </div>
      ))}
      {channelDataList.map((channelData, index) => {
        return (
          <div key={index}>
            <h2>Channel Data {index + 1}</h2>
            {channelData.items && channelData.items.map((channel, idx) => (
              <div key={idx}>
                <p>Title: {channel.snippet.title}</p>
                <p>Description: {channel.snippet.description}</p>
                <p>View Count: {channel.statistics.viewCount}</p>
                <p>Video Count: {channel.statistics.videoCount}</p>
                <p>Subscriber Count: {channel.statistics.subscriberCount}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default BatchSearch;
