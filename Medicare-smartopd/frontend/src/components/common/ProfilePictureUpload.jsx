import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Camera, X, Check, Search, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePictureUpload({ initialImage, onSave, userName }) {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImage(reader.result);
                setShowModal(true);
            };
        }
    };

    const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
        const image = await new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('error', (error) => reject(error));
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = imageSrc;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return canvas.toDataURL('image/jpeg', 0.8);
    };

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
            onSave(croppedImage);
            setShowModal(false);
            toast.success("Profile photo updated!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to crop image");
        }
    };

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(/\s+/);
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    return (
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px' }}>
            <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'var(--primary-color-light)',
                color: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                fontWeight: 800,
                border: '4px solid #fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
                {initialImage ? (
                    <img src={initialImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    getInitials(userName || "User")
                )}
            </div>

            <label style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '36px',
                height: '36px',
                background: 'var(--primary-color)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '3px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
                <Camera size={18} />
                <input type="file" onChange={onFileChange} style={{ display: 'none' }} accept="image/*" />
            </label>

            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10001,
                    padding: '20px'
                }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '500px',
                        height: '500px',
                        background: '#111',
                        borderRadius: '24px',
                        overflow: 'hidden'
                    }}>
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropShape="round"
                            showGrid={true}
                        />
                    </div>

                    <div style={{
                        width: '100%',
                        maxWidth: '500px',
                        padding: '24px',
                        background: '#fff',
                        marginTop: '20px',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Search size={20} color="#666" />
                            <input 
                                type="range" 
                                value={zoom} 
                                min={1} 
                                max={3} 
                                step={0.1} 
                                onChange={(e) => setZoom(e.target.value)}
                                style={{ flex: 1 }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <RotateCcw size={20} color="#666" />
                            <input 
                                type="range" 
                                value={rotation} 
                                min={0} 
                                max={360} 
                                step={1} 
                                onChange={(e) => setRotation(e.target.value)}
                                style={{ flex: 1 }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={() => setShowModal(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #ddd', background: '#fff', fontWeight: 700, cursor: 'pointer' }}
                            >
                                <X size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave}
                                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: 'none', background: 'var(--primary-color)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                            >
                                <Check size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                Crop & Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
