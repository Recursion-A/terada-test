'use client'

import React, {useState, useEffect} from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/hello`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      setMessage(data.message)
    })
  })

  return (
    <div>
      <h1>Next.js + Go API Example</h1>
      <p>Message from Go API: {message}</p>
    </div>
  );
}
