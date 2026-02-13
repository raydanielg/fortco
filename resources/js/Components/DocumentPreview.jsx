import { useEffect } from 'react';

export default function DocumentPreview({
    open = false,
    title = 'Document Preview',
    onBack = () => {},
    onPrint = null,
    kind = 'html',
    src = '',
    srcDoc = '',
    iframeRef = null,
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === 'Escape') onBack();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onBack]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-slate-200">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
                    <div className="text-[12px] font-semibold text-slate-900">{title}</div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onBack}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Back
                        </button>
                        {onPrint ? (
                            <button
                                type="button"
                                onClick={onPrint}
                                className="rounded-xl border border-slate-900 bg-slate-900 px-4 py-2 text-[12px] font-semibold text-white hover:bg-slate-800"
                            >
                                Print / Save as PDF
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="h-[calc(100vh-54px)] overflow-hidden p-0">
                <div className="mx-auto h-full w-full max-w-none p-2 md:p-3">
                    <div className="h-full overflow-hidden rounded-lg border border-slate-300 bg-white shadow">
                        {kind === 'image' ? (
                            <div className="flex h-full w-full items-center justify-center bg-white">
                                <img src={src} alt="Preview" className="max-h-full max-w-full object-contain" />
                            </div>
                        ) : (
                            <iframe
                                ref={iframeRef}
                                title={title}
                                className="h-full w-full bg-white"
                                src={kind === 'url' ? src : undefined}
                                srcDoc={kind === 'html' ? srcDoc : undefined}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
