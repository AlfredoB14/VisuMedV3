import { useEffect, useState, useRef } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";

// 1) Inicializar Cornerstone
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.configure({
    beforeSend: (xhr) => {
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    }
});

const Vision = () => {
    const [images, setImages] = useState([]);
    const [idx, setIdx] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const viewportRef = useRef(null);

    // 2) Montar la lista de URLs con .dcm
    useEffect(() => {
        setImages([
            "/00000001.unknown",
            "/00000002.unknown",
        ]);
        setLoading(false);
    }, []);

    // 3) Cada vez que cambie idx o termine loading, cargar imagen
    useEffect(() => {
        if (!loading && images.length) {
            loadAndDisplay();
        }
    }, [idx, loading]);

    const loadAndDisplay = async () => {
        const url = images[idx];
        const imageId = `wadouri:${url}`;  // prefijo para WADO-URI

        try {
            setError(null);
            const element = viewportRef.current;
            cornerstone.enable(element);

            // carga y render
            const image = await cornerstone.loadImage(imageId);
            cornerstone.displayImage(element, image);

        } catch (e) {
            console.error("Error DICOM:", e);
            setError(`No se pudo cargar DICOM: ${e.message}`);
        }
    };

    const prev = () => setIdx((i) => Math.max(0, i - 1));
    const next = () => setIdx((i) => Math.min(images.length - 1, i + 1));

    if (loading) return <p>Cargando lista de DICOMs…</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Visor DICOM</h1>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 p-3 mb-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}
            <div className="flex items-center gap-4 mb-2">
                <button onClick={prev} disabled={idx === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300">
                    ←
                </button>
                <span>{idx + 1} / {images.length}</span>
                <button onClick={next} disabled={idx === images.length - 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300">
                    →
                </button>
            </div>
            <div
                ref={viewportRef}
                className="border border-gray-300 rounded-lg"
                style={{ width: "512px", height: "512px", background: "#000" }}
            />
        </div>
    );
};

export default Vision;
