'use client'
import { React, useEffect, useState } from 'react';
import { Alert } from 'antd';
import { Card, Text, Title, Grid, Col, Metric, Italic, Callout, Badge } from "@tremor/react";

const keyToTitle = {
  "PRE_CALL": "Arguments passed to Provider",
  "EXCEPTION": "Exception",
  "KWARGS": "Arguments to litellm.completion",
  "POST_CALL": "Results of litellm.completion call",
};

const topRowKeys = ['PRE_CALL', 'EXCEPTION'];
const bottomRowKeys = ['KWARGS', 'POST_CALL'];

const HomePage = () => {
  const [jsonData, setJsonData] = useState({
    'PRE_CALL': '',
    'EXCEPTION': '',
    'KWARGS': '',
    'POST_CALL': '',
  });
  const [exception, setException] = useState('');
  const [model, setModel] = useState('');
  const [messages, setMessages] = useState('');

  useEffect(() => {
    // Get the current URL
    var currentURL = window.location.href;
    console.log('current url', currentURL);

    let params = (new URL(currentURL)).searchParams;
    console.log('params', params);
    const jsonDataString = params.get('data'); // is the string with your JSON
    console.log("json data", jsonDataString);
    try {
      const parsedData = JSON.parse(jsonDataString) || {}; // Ensure parsedData is an object, default to an empty object if parsing fails
      setJsonData(parsedData);
      setException(parsedData['EXCEPTION'] ?? '');
      setModel(parsedData['KWARGS']?.['model'] ?? '');
      setMessages(parsedData['KWARGS']?.['messages'] ?? '');
    } catch (error) {
        console.error("Error parsing JSON data:", error);
    }
  }, []); // Empty dependency array to run this effect only once after component mount

  // Render the component only when jsonData is available


  const topRowCards = topRowKeys.map((key) => (
    <Col numColSpan={1} key={key} className='mt-5 mx-2'>
      <Card style={{ overflowY: 'auto', whiteSpace: 'pre-wrap'}}>
        <Title>{keyToTitle[key]}</Title> {/* Use the mapped title */}
        {key === 'EXCEPTION' ? (
          <Alert description={exception} type="error" showIcon />
        ) : (
          <Text>
            <pre><code>
              {JSON.stringify(jsonData[key], null, 2)}
            </code></pre>
          </Text>
        )}
      </Card>
    </Col>
  ));

  const bottomRowCards = bottomRowKeys.map((key) => (
    <Col numColSpan={1} key={key} className='mt-5 mx-2'>
      <Card style={{ overflowY: 'auto', whiteSpace: 'pre-wrap'}}>
        <Title>{keyToTitle[key]}</Title> {/* Use the mapped title */}
        <Text>
          <pre><code>
            {JSON.stringify(jsonData[key], null, 2)}
          </code></pre>
        </Text>
      </Card>
    </Col>
  ));

  const pageStyle = {
    backgroundColor: 'white', // Add a white background color
    padding: '20px', // Add padding for spacing
    display: 'flex', // Use flex display to arrange cards vertically
    flexDirection: 'column', // Arrange cards in a column
  };

  return (
      <div style={pageStyle}>
        <Title>LiteLLM Request Log</Title>
        <Metric className='my-4' color="sky">litellm.completion() <Badge color='red'>error</Badge></Metric>
        <Grid numItems={2}>
          <Col className='mx-2 mt-3'>
            <Card>
              <Title>Model: {model}</Title>
              <Title>Messages: {messages}</Title>
            </Card>
          </Col>
          <Col className='mx-2'>
            <Alert description={exception} type="error" showIcon className='mx-2 mt-5'/>
          </Col>
          {topRowCards}
          {bottomRowCards}
        </Grid>
      </div>
  );
};

export default HomePage;
