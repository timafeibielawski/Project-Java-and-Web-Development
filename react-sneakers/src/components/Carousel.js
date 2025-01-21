import React from 'react';
import { Carousel } from 'antd'; // Importing Carousel component from Ant Design

// Inline style for the carousel content
const contentStyle = {
  height: '300px', // Height of the carousel item
  color: '#fff', // Text color
  lineHeight: '160px', // Line height for text alignment
  textAlign: 'center', // Center-align the text
  background: '#364d79', // Background color of the carousel item
};

const CarouselElement = () => {
  return (
    <div className="pt-[45px] pb-[25px] px-[60px]">
      {/* Wrapper with padding for layout */}
      <div className="rounded-xl overflow-hidden">
        {/* Ant Design Carousel with autoplay */}
        <Carousel autoplay>
          {/* Each carousel slide */}
          <div>
            <h3 style={contentStyle}>
              <img src="/img/slider/s1.png" alt="slider 1" /> {/* Image for the first slide */}
            </h3>
          </div>
          <div>
            <h3 style={contentStyle}>
              <img src="/img/slider/s2.jpg" alt="slider 2" /> {/* Image for the second slide */}
            </h3>
          </div>
          <div>
            <h3 style={contentStyle}>
              <img src="/img/slider/s3.jpg" alt="slider 3" /> {/* Image for the third slide */}
            </h3>
          </div>
          <div>
            <h3 style={contentStyle}>
              <img src="/img/slider/s4.jpg" alt="slider 4" /> {/* Image for the fourth slide */}
            </h3>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselElement;
