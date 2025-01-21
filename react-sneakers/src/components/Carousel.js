import React from 'react';
import { Carousel } from 'antd';

const contentStyle = {
  height: '300px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

const CarouselElement = () => {
  return (
    <div className="pt-[45px] pb-[25px] px-[60px]">
      <div className='rounded-xl overflow-hidden'>
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>
            <img src="/img/slider/s1.png" alt="empty icon" />
            </h3>
          </div>
          <div>
            <h3 style={contentStyle}>
            <img src="/img/slider/s2.jpg" alt="empty icon" />
            </h3>
          </div>
          <div>
            <h3 style={contentStyle}>
            <img src="/img/slider/s3.jpg" alt="empty icon" />
            </h3>
          </div>
          <div>
            <h3 style={contentStyle}>
            <img src="/img/slider/s4.jpg" alt="empty icon" />
            </h3>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselElement;
