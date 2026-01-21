import React, { ImgHTMLAttributes } from 'react';
import icon from '@/assets/react.svg';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    fallback?: string;
    loading?: 'lazy' | 'eager';
}

const Image: React.FC<ImageProps> = ({
    src,
    alt,
    fallback = icon,
    loading = 'lazy',
    ...props
}) => {
    const [imgSrc, setImgSrc] = React.useState(src);

    const handleError = () => {
        setImgSrc(fallback);
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            loading={loading}
            onError={handleError}
            {...props}
        />
    );
};

export default Image;