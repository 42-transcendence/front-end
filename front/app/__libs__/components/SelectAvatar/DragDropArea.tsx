export function DragDropArea({
    handleFiles,
}: {
    handleFiles: (files: FileList | null) => void;
}) {
    const dragEffect = "bg-red-500";

    const handleDrag: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    };

    const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        target.classList.add(dragEffect);
    };

    const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        const target = e.target as HTMLDivElement;
        target.classList.remove(dragEffect);
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div
            className="absolute z-20 flex h-full w-full flex-col justify-center rounded-xl bg-windowGlass/30 text-center"
            onDrag={handleDrag}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            파일 선택
        </div>
    );
}
