import React from 'react';

export default async function Page() {
  // Fetch data from the API route
  const response = await fetch('http://localhost:3000/path/api', {
    next: { revalidate: 10 }, 
  });
  
  // Check if the response is okay and parse JSON
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  // Render the data in an <h1> element
  return <h1>{JSON.stringify(data)}</h1>;
}
