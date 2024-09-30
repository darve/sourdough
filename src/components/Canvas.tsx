
import { useState, useEffect, useCallback, useRef } from 'react'
import { off, on } from '../lib/util';

type CanvasProps = {
    clip: () => any;
}

function Canvas(props: CanvasProps) {

    const clip = props.clip();
 
    const c = useRef<HTMLCanvasElement>(null);
    const dpi = window.devicePixelRatio;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ww = w*dpi;
    const wh = h*dpi;
    
    let scroll = [0,0];
    let [cx, set_cx] = useState<CanvasRenderingContext2D | null>(null);

    let pos = [0,0];
    let pan = [0,0];
    let start = [0, 0];
    let down = false;
    let framecount = 0;

    useEffect(() => {
        console.log('mounting canvas');
        if (c.current) {
            set_cx(c.current.getContext('2d'));
        }
    }, [c]);

    useEffect(() => {
        const mountClip = async () => {
            if (cx) {
                await clip.mount({ cx, pos, pan, scroll, start, down, framecount, ww, wh, dpi });
                tick();
            }
        };
        mountClip();
    }, [cx])

    const tick = async () => {
        framecount++;
        await clip.tick({ cx, pos, pan, scroll, start, down, framecount, ww, wh });
        requestAnimationFrame(tick);
    }

    const updateScroll = (e: WheelEvent) => {
      e.preventDefault();
      scroll = [e.deltaX + scroll[0], e.deltaY + scroll[1]];
    };

    on(window, 'wheel', updateScroll, false);

    useEffect(() => {
        return () => {
            off(window, 'wheel', updateScroll, false);
        }
    }, []);

    const render = () => {
        return (
            <div className="canvas-wrapper">
                <canvas
                    className="gif-canvas"
                    ref={c}
                    width={ww}
                    height={wh} 
                    onMouseDown={mouse_down}
                    onMouseUp={mouse_up}
                    onTouchStart={touch_down}
                    onTouchEnd={touch_up}
                    onMouseMove={mouse_move}
                    onTouchMove={touch_move} />
            </div>
        )
    }

    /**
     * Event listeners below
     */
    const pointer_down = useCallback( (_x, _y) => {
        down = true;
        pos = [_x, _y];
        start = [_x, _y];
    }, []);

    const pointer_up = useCallback( (_x, _y) => {
        down = false;
    }, []);

    const pointer_move = useCallback( (_x, _y) => {
        pos = [_x, _y];
    }, []);

    const mouse_down = useCallback( e => {
        e.preventDefault();
        pointer_down(e.pageX * dpi, e.pageY * dpi);
    }, []);

    const mouse_move = useCallback( e => {
        e.preventDefault();
        pointer_move(e.pageX * dpi, e.pageY * dpi);
    }, []);

    const mouse_up = useCallback( e => {
        e.preventDefault();
        pointer_up(e.pageX * dpi, e.pageY * dpi);
    }, []);

    const touch_down = useCallback( e => {
        e.preventDefault();
        if (e.touches.length === 1) {
            pointer_down(e.touches[0].pageX * dpi, e.touches[0].pageY * dpi);
        }
    }, []);

    const touch_move = useCallback( e => {
        e.preventDefault();
        if (e.touches.length === 1) {
            pointer_move(e.touches[0].pageX * dpi, e.touches[0].pageY * dpi);
        }
    }, []);

    const touch_up = useCallback( e => {
        e.preventDefault();
        pointer_up(e.changedTouches[0].pageX * dpi, e.changedTouches[0].pageY * dpi);
    }, []);

    return render();
}

export default Canvas