// src/pages/home.jsx
import React, { useState, useEffect } from 'react';
import { client } from '../client'; // <-- IMPORT SANITY CLIENT

// Import all your page sections
import Hero from "../components/Hero";
import MissionSection from "../components/missionsection";
import CounterSection from "../components/countersection";
import ServicesSection from "../components/servicessection";
import DonationSection from "../components/collectivegrowth";
import BlogSection from "../components/blogsection";
import MiniAdBanner from "../components/ProductCarousel";

// This one query professionally fetches all data for this page
const homePageQuery = `
{
  "home": *[_type == "homePage"][0] {
    missionTitle,
    missionBio
  },
  "about": *[_type == "aboutPage"][0] {
    profileImage
  }
}
`;

const Home = () => {
  // Set up state to hold all your fetched data
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the data when the page loads
  useEffect(() => {
    client.fetch(homePageQuery)
      .then((data) => {
        setPageData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch homepage data:", err);
        setIsLoading(false); // Let components use their fallbacks
      });
  }, []); // The empty [] means this runs only once

  // --- THIS IS THE KEY ---
  // We assemble the 'missionData' prop by combining
  // data from both 'home' and 'about'
  const missionData = {
    missionTitle: pageData?.home?.missionTitle,
    missionBio: pageData?.home?.missionBio,
    profileImage: pageData?.about?.profileImage, // <-- Fetched from aboutPage
  };

  return (
    <div>
      <Hero /> 
      
      {/* We pass the combined data down as a prop.
        The MissionSection component will handle the loading state.
      */}
      <MissionSection 
        missionData={missionData} 
        isLoading={isLoading} 
      />
      
      <MiniAdBanner/>
      <BlogSection/>
      <CounterSection/>
      <ServicesSection/>
      <DonationSection/>
   
    </div>
  );
};

export default Home;