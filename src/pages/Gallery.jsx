import { useState, useEffect } from 'react';
import { Image, X, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { getGalleryImages } from '../services/firebase';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    // Default images including venue photo
    const defaultImages = [
        { id: 1, url: 'a916fd8f-8849-48e9-a74d-ec4b3b56767a.png', caption: 'Our Premium Courts' },
    ];

    useEffect(() => {
        const fetchImages = async () => {
            const { images: galleryImages } = await getGalleryImages();
            setImages(galleryImages.length > 0 ? galleryImages : defaultImages);
            setLoading(false);
        };
        fetchImages();
    }, []);

    const openLightbox = (index) => {
        setSelectedImage(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = '';
    };

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="min-h-screen pt-40 pb-16 bg-[#020617]">

            <div className="max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">Our Space</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Photo <span className="text-yellow-gradient">Gallery</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        A glimpse into the HQ Sport experience. Where passion meets perfection.
                    </p>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[4/3] rounded-3xl bg-[#0f172a] animate-pulse border border-slate-800"
                            ></div>
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-24 glass-card">
                        <Image className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No images yet</h3>
                        <p className="text-slate-400">Check back soon for photos of our venue!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image, index) => (
                            <button
                                key={image.id}
                                onClick={() => openLightbox(index)}
                                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#0f172a] border border-slate-800 hover:border-yellow-500/30 transition-all duration-500"
                            >
                                <img
                                    src={image.url}
                                    alt={image.caption || `Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <p className="text-white font-semibold text-lg">{image.caption || 'HQ Sport'}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Lightbox */}
                {selectedImage !== null && (
                    <div
                        className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-xl flex items-center justify-center animate-fade-in"
                        onClick={closeLightbox}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 p-3 rounded-xl bg-slate-800/50 text-white hover:bg-slate-800 transition-colors z-50 border border-slate-700"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Navigation arrows */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-6 p-3 rounded-xl bg-slate-800/50 text-white hover:bg-slate-800 transition-colors z-50 border border-slate-700 hidden md:flex"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-6 p-3 rounded-xl bg-slate-800/50 text-white hover:bg-slate-800 transition-colors z-50 border border-slate-700 hidden md:flex"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>

                        {/* Image */}
                        <div
                            className="max-w-6xl max-h-[85vh] px-4 md:px-20 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={images[selectedImage].url}
                                alt={images[selectedImage].caption || 'Gallery image'}
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                            />
                            {images[selectedImage].caption && (
                                <p className="text-white text-center mt-6 font-medium text-lg">
                                    {images[selectedImage].caption}
                                </p>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 overflow-x-auto max-w-[90vw] p-2 no-scrollbar">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedImage(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${index === selectedImage ? 'bg-yellow-400 w-8' : 'bg-slate-700 hover:bg-slate-500'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
