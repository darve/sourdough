import { useEffect, useState } from 'react';
import { off, on } from './util';

export default () => {
  const [mouseWheelScrolled, setMouseWheelScrolled] = useState([0,0]);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const updateScroll = (e: WheelEvent) => {
      e.preventDefault();
      setX(e.deltaX+x);
      setY(e.deltaY+y);
    };
    on(window, 'wheel', updateScroll, false);
    return () => off(window, 'wheel', updateScroll);
  });

  return { x, y };

};