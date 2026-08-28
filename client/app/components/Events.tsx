import React from 'react'; 
import UpcomingEvents from './UpcomingEvents'; 
import PastEvents from './PastEvents'; 
 
export default function Events() { 
  return ( 
    <section className="flex flex-col gap-16 pb-16"> 
      <UpcomingEvents /> 
      <PastEvents /> 
    </section> 
  ); 
} 
