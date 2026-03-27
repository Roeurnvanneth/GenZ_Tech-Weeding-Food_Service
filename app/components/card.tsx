import React from 'react';
import Link from 'next/link'; // 1. Import Link for navigation

// Styles
const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    backgroundColor: 'transparent',
    padding: '20px'
};

const cardStyle: React.CSSProperties = {
    position: 'relative',
    width: '320px',
    height: '200px',
    overflow: 'hidden',
    borderRadius: '8px',
    backgroundColor: '#444',
    cursor: 'pointer' // Shows a hand icon when hovering
};

const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s ease' // Subtle zoom effect
};

const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    background: 'rgba(0,0,0,0.6)',
    color: 'white',
    textAlign: 'center',
    padding: '10px 0'
};

// 2. Updated Interface to include 'href' (the link)
interface GalleryProps {
    images: { 
        src: string; 
        label: string; 
        href: string; // Destination URL
    }[];
}

const FoodGallery: React.FC<GalleryProps> = ({ images }) => {
    return (
        <div style={containerStyle}>
            {images.map((item, index) => (
                /* 3. Wrap everything in a Link */
                <Link href={item.href} key={index} style={{ textDecoration: 'none' }}>
                    <div style={cardStyle}>
                        <img
                            src={item.src}
                            alt={item.label}
                            style={imageStyle}
                            // Added a hover effect class if you use CSS, 
                            // or just keep it simple for now.
                        />
                        <div style={overlayStyle}>
                            <h3 style={{ margin: 0 }}>{item.label}</h3>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default FoodGallery;