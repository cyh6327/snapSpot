// src/components/MapDisplay.js
import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const MapDisplay = ({ places }) => {
  const mapRef = useRef(null); // 지도를 표시할 DOM 레퍼런스

  useEffect(() => {
      if (window.naver && mapRef.current) {
          const map = new window.naver.maps.Map(mapRef.current, {
              center: new window.naver.maps.LatLng(37.3595704, 127.105399), // 초기 중심 좌표 설정
              zoom: 10 // 초기 줌 레벨 설정
          });

          // places 객체의 각 키를 반복하면서 마커 추가
          Object.keys(places).forEach(key => {
              places[key].forEach(place => {
                  const { mapx, mapy } = place;
                  const position = new window.naver.maps.LatLng(mapy, mapx);

                  // 마커 생성
                  new window.naver.maps.Marker({
                      map: map,
                      position: position,
                      title: place.title.replace(/<[^>]+>/g, '') // HTML 태그 제거
                  });
              });
          });
      }
  }, [places]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapDisplay;
