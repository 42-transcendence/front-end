function DragDropArea({
    handleFiles
}: {
    handleFiles: (files: FileList | null) => void
}) {

    const handleDrag: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    }

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    }

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    }

    return (
        <div className="bg-green-500"
            onDrag={handleDrag}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            drag and drop file
        </div>
    );
}

export { DragDropArea };
