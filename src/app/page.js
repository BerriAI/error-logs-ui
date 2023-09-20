'use client'
// pages/index.js
import { Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Text, Title, Grid, Col, Metric, Italic, Callout, Badge } from "@tremor/react";
const keyToTitle = {
  "PRE_CALL": "Arguments passed to Provider",
  "EXCEPTION": "Exception",
  "KWARGS": "Arguments to litellm.completion",
  "POST_CALL": "Results of litellm.completion call",
};

const topRowKeys = ['PRE_CALL', 'EXCEPTION'];
const bottomRowKeys = ['KWARGS', 'POST_CALL'];
let jsonData = {
  'PRE_CALL':'',
  'EXCEPTION': '',
  'KWARGS': '',
  'POST_CALL': ''
};

const HomePage = () => {
  console.log("GMMMM@@@@");
  const router = useRouter();
  console.log('router', router.query);


  console.log('router', router.asPath);

  useEffect(() => {
    if(router && router.query) {
      const { data } = router.query;
      console.log(router);
      console.log(router.query);
      try {
        let parsedData = JSON.parse(data);
        if (parsedData) {
          jsonData['PRE_CALL'] = parsedData['PRE_CALL'] || '';
          jsonData['EXCEPTION'] = parsedData['EXCEPTION'] || '';
          jsonData['KWARGS'] = parsedData['KWARGS'] || '';
          jsonData['POST_CALL'] = parsedData['POST_CALL'] || '';
        }
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
  }, [router.isReady]);



  let exception = jsonData['EXCEPTION']
  console.log(exception)
  let model = jsonData['KWARGS']['model']
  let messages = jsonData['KWARGS']['messages']

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
    <div>
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

    </div>
    
  );
};

export default HomePage;
