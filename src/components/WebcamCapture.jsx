// src/components-guestbook/WebcamCapture.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, Loader } from "lucide-react";

const videoConstraints = {
  width: 320,
  height: 240,
  facingMode: "user",
};

const WebcamCapture = ({ onCapture }) => {
  const [image, setImage] = useState(null);
  const [fotoTaken, setFotoTaken] = useState(false);
  const [isWebcamLoading, setIsWebcamLoading] = useState(true);
  const [hasWebcamError, setHasWebcamError] = useState(false);
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setFotoTaken(true);
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  const retake = () => {
    setImage(null);
    setFotoTaken(false);
    onCapture(null);
  };

  const handleWebcamLoad = () => {
    setIsWebcamLoading(false);
    setHasWebcamError(false);
  };

  const handleWebcamError = () => {
    setIsWebcamLoading(false);
    setHasWebcamError(true);
  };

  return (
    <div>
      <label className="block font-semibold text-slate-700 mb-2">
        Foto Diri
      </label>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 flex flex-col items-center justify-center gap-4">
        <div className="w-[320px] h-[240px] rounded-lg overflow-hidden border-2 border-dashed border-gray-400 bg-white flex items-center justify-center relative">
          {image ? (
            <img
              src={image}
              alt="Hasil foto"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {/* Loading Skeleton */}
              {isWebcamLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <div className="text-center">
                    <Loader className="animate-spin text-gray-500 mx-auto mb-2" size={32} />
                    <p className="text-gray-600 text-sm">Menyiapkan kamera...</p>
                  </div>
                </div>
              )}
              
              {/* Error State */}
              {hasWebcamError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                  <div className="text-center">
                    <Camera className="text-red-500 mx-auto mb-2" size={32} />
                    <p className="text-red-600 text-sm font-medium">Kamera tidak dapat diakses</p>
                    <p className="text-red-500 text-xs mt-1">Pastikan kamera sudah diizinkan</p>
                  </div>
                </div>
              )}
              
              {/* Webcam */}
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                mirrored={true}
                className="w-full h-full"
                onLoadedData={handleWebcamLoad}
                onError={handleWebcamError}
                style={{ 
                  display: hasWebcamError || isWebcamLoading ? 'none' : 'block' 
                }}
              />
            </>
          )}
        </div>
        
        {fotoTaken && (
          <div className="text-center">
            <p className="text-green-600 font-medium text-lg">✓ Foto Sudah Berhasil Diambil</p>
          </div>
        )}
        
        <div>
          {image ? (
            <button
              type="button"
              onClick={retake}
              className="w-40 mt-2 flex items-center justify-center gap-2 bg-amber-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-600 transition transform hover:scale-105"
            >
              <RefreshCw size={16} />
              Ulangi
            </button>
          ) : (
            <button
              type="button"
              onClick={capture}
              disabled={isWebcamLoading || hasWebcamError}
              className="w-40 mt-2 flex items-center justify-center gap-2 bg-sky-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-sky-600 transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Camera size={16} />
              {isWebcamLoading ? "Loading..." : "Ambil Foto"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;