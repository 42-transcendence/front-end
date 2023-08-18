import { useRef, useEffect } from "react";

export function ImageViewer({ uploadedFiles }: { uploadedFiles: File[] }) {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const previewElem = previewRef.current;
        if (previewElem === null) return;

        while (previewElem.firstChild !== null) {
            previewElem.removeChild(previewElem.firstChild);
        }

        //TODO: is this validation neccessary?
        for (const file of uploadedFiles) {
            if (!file.type.startsWith("image/")) {
                continue;
            }

            const img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            // TODO: appropriate attributes
            // img.alt = file.name;
            // img.width = 250;
            // img.height = 250;
            // img.crossOrigin = "use-credentials";
            // img.decoding = "async";
            // img.loading = "lazy";
            // img.sizes = "";
            previewElem.appendChild(img);
        }

    }, [uploadedFiles]);

    return <div ref={previewRef} className="absolute h-full w-full"></div>;
}
