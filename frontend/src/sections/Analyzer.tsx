import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Info, RefreshCw, FileImage, Home, Sparkles, Camera, StopCircle, Coins, MapPin, Lightbulb } from 'lucide-react';
import { cn } from '../utils/cn';

const Analyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFile = (selectedFile: File) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
      handleAnalyze(selectedFile);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const startCamera = async () => {
    setError(null);
    setResult(null);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Your browser does not support camera access.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
      setIsCameraActive(true);
      setPreview(null);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

    } catch (err: any) {
      console.error("Error accessing camera:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError("Camera access denied. Please enable camera permissions in your browser settings.");
      } else {
        setError(`Could not access camera: ${err.message || "Unknown error"}`);
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreview(dataUrl);
        stopCamera();
        
        // Convert base64 to File object for backend
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const capturedFile = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            handleAnalyze(capturedFile);
          });
      }
    }
  };

  const handleAnalyze = async (selectedFile: File) => {
    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || "Analysis failed");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to connect to the analysis service. Please ensure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    stopCamera();
  };

  return (
    <section id="analyzer" className="py-24 bg-light-200/50 dark:bg-dark-800/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Waste Analyzer</h2>
          <p className="text-gray-500 dark:text-gray-400">Use your camera or upload an image to identify waste materials.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div
              onDragOver={!isCameraActive ? onDragOver : undefined}
              onDragLeave={!isCameraActive ? onDragLeave : undefined}
              onDrop={!isCameraActive ? onDrop : undefined}
              className={cn(
                "relative aspect-square md:aspect-auto md:h-[400px] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden group bg-white dark:bg-dark-900/50",
                isDragging ? "border-emerald-500 bg-emerald-500/5 scale-[1.02]" : "border-gray-300 dark:border-white/10",
                preview || isCameraActive ? "border-emerald-500/50" : ""
              )}
            >
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
                    <button 
                      onClick={capturePhoto}
                      className="bg-emerald-500 text-white p-4 rounded-full shadow-xl hover:bg-emerald-600 transition-all transform active:scale-90"
                    >
                      <Camera className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={stopCamera}
                      className="bg-red-500 text-white p-4 rounded-full shadow-xl hover:bg-red-600 transition-all transform active:scale-90"
                    >
                      <StopCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : preview ? (
                <div className="relative w-full h-full group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/30 transition-all"
                    >
                      <Upload className="w-4 h-4" /> Change
                    </button>
                    <button 
                      onClick={startCamera}
                      className="bg-emerald-500/80 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-500 transition-all"
                    >
                      <Camera className="w-4 h-4" /> Camera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all",
                    isDragging ? "bg-emerald-500 text-white scale-110" : "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500"
                  )}>
                    <FileImage className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {isDragging ? "Drop to Analyze" : "Identify Waste"}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
                    Drag an image, click to upload, or use your camera
                  </p>
                  
                  <div className="flex flex-col w-full gap-3 max-w-[240px]">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <Upload className="w-4 h-4" /> Upload File
                    </button>
                    <button 
                      onClick={startCamera}
                      className="glass dark:bg-white/5 border border-gray-200 dark:border-white/10 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
                    >
                      <Camera className="w-4 h-4" /> Live Camera
                    </button>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            {preview && !isAnalyzing && (
              <div className="flex gap-4">
                <button
                  onClick={reset}
                  className="w-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  Try Another
                </button>
              </div>
            )}
          </motion.div>

          {/* Results Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="min-h-[400px]"
          >
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center glass dark:bg-white/5 rounded-[2.5rem] p-12 text-center"
                >
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Analyzing Material...</h3>
                  <p className="text-gray-500 dark:text-gray-400">Our neural network is processing the visual data.</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass dark:bg-white/5 rounded-[2.5rem] p-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 h-full"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1 block">Analysis Result</span>
                      <h3 className="text-3xl font-bold">{result.item}</h3>
                    </div>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/50 dark:border-white/5">
                      <span className="text-gray-500 dark:text-gray-400">Category</span>
                      <span className="font-bold">{result.category}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/50 dark:bg-white/5 rounded-2xl border border-white/50 dark:border-white/5">
                      <span className="text-gray-500 dark:text-gray-400">Bin Destination</span>
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20">{result.bin}</span>
                    </div>

                    {/* Earn From Recycling Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/20 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                          <Coins className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-bold">💰 Earn From Recycling</h4>
                      </div>

                      {result.market_value?.has_value ? (
                        <div className="space-y-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-dark-900 dark:text-white">{result.market_value.price_per_unit}</span>
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">Per {result.market_value.unit}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {result.market_value.earnings_estimate?.slice(0, 2).map((est: any, idx: number) => (
                              <div key={idx} className="bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{est.label}</p>
                                <p className="text-sm font-bold text-emerald-500">{est.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">This item has little direct scrap value.</p>
                      )}
                    </motion.div>

                    {/* Recycle At Home Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4 p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/20 shadow-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
                          <Home className="w-5 h-5" />
                        </div>
                        <h4 className="text-lg font-bold">🏡 Recycle At Home</h4>
                      </div>

                      {typeof result.home_recycling === 'string' && result.home_recycling.startsWith('UNSAFE:') ? (
                        <p className="text-xs text-red-500 font-medium">⚠️ {result.home_recycling.replace('UNSAFE:', '').trim()}</p>
                      ) : (
                        <ul className="space-y-2">
                          {Array.isArray(result.home_recycling) && result.home_recycling.slice(0, 2).map((idea: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                              {idea}
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">AI Confidence</span>
                        <span className="font-bold text-emerald-500">{result.confidence}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        />
                      </div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex gap-4"
                    >
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                        This item is <span className="font-bold">{result.recyclable ? 'recyclable' : 'not recyclable'}</span>. {result.impact?.benefit}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center glass dark:bg-white/5 rounded-[2.5rem] p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/5">
                  <div className="relative mb-6">
                    <AlertCircle className="w-16 h-16 opacity-20" />
                    <motion.div 
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-gray-400/10 blur-xl rounded-full"
                    />
                  </div>
                  <p className="text-lg font-medium mb-2">Ready for Analysis</p>
                  <p className="text-sm max-w-[200px]">Drag an image into the box, click to upload, or use your camera to see AI results.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Analyzer;
