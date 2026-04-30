import { useState, useEffect, useCallback } from 'react';
import './YouTubeEmbed.css';

export default function YouTubeEmbed({ videoId, title: propTitle, channel: propChannel }) {
  const [playing, setPlaying] = useState(false);
  const [meta, setMeta] = useState({ title: propTitle || '', channel: propChannel || '' });
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (propTitle && propChannel) return;
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then((r) => r.json())
      .then((d) => {
        setMeta({
          title: propTitle || d.title || 'Video',
          channel: propChannel || d.author_name || 'YouTube',
        });
      })
      .catch(() => {});
  }, [videoId, propTitle, propChannel]);

  const handlePlay = useCallback(() => setPlaying(true), []);

  return (
    <div className="yt-card">
      <div className="yt-wrapper">
        {!playing ? (
          <button
            className="yt-facade"
            onClick={handlePlay}
            aria-label="Play video"
          >
            <img
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className="yt-thumb"
              style={{ opacity: imgLoaded ? 1 : 0 }}
            />
            <div className="yt-gradient" />
            <div className="yt-play">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={meta.title || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="yt-iframe"
          />
        )}
      </div>
      <div className="yt-info">
        <p className="yt-title">{meta.title || 'Loading…'}</p>
        <p className="yt-channel">{meta.channel || 'YouTube'}</p>
      </div>
    </div>
  );
}
