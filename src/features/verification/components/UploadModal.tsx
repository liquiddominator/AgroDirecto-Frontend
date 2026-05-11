import { useState, useEffect } from "react";
import { CloudUpload, X, FileCheck, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (docType: string, docNumber: string, file: File) => Promise<void>;
  initialDocType?: string;
  documentTypes: { code: string; label: string }[];
}

export function UploadModal({ isOpen, onClose, onSubmit, initialDocType, documentTypes }: UploadModalProps) {
  const [selectedDocType, setSelectedDocType] = useState(initialDocType || "");
  const [docNumber, setDocNumber] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedDocType(initialDocType || (documentTypes.length > 0 ? documentTypes[0].code : ""));
      setDocNumber("");
      setFile(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialDocType, documentTypes]);

  const docTypeLabel = documentTypes.find((opt) => opt.code === selectedDocType)?.label || "documento";

  const handleSave = async () => {
    if (!selectedDocType || !file) {
      toast.error("Por favor adjunta el archivo del documento.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(selectedDocType, docNumber, file);
      toast.success("Documento guardado", {
        description: "El documento se registró correctamente.",
      });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al subir documento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden p-0 border-0 shadow-2xl"
      >
        <DialogHeader
          className="flex flex-row items-center justify-between px-6 py-4 border-b border-green-100 bg-gradient-to-br from-green-50 to-green-100 m-0 space-y-0"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-800 to-green-500"
            >
              <CloudUpload className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle className="text-slate-900 text-base m-0 font-bold">
                Subir {docTypeLabel}
              </DialogTitle>
              <p className="text-slate-500 text-xs m-0">Completa los datos y adjunta el archivo</p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1.5 font-semibold">Número de documento</label>
            <Input
              type="text"
              placeholder="Ej. 12345678"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1.5 font-semibold">Archivo del documento</label>
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging ? "border-green-500 bg-green-50" : "border-slate-200 hover:border-green-400 hover:bg-slate-50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const droppedFile = e.dataTransfer.files[0]; if (droppedFile) setFile(droppedFile); }}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,.jpg,.jpeg,.png";
                input.onchange = (e) => { const selectedFile = (e.target as HTMLInputElement).files?.[0]; if (selectedFile) setFile(selectedFile); };
                input.click();
              }}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100">
                    <FileCheck className="w-6 h-6 text-green-800" />
                  </div>
                  <p className="text-sm text-slate-900 font-semibold">{file.name}</p>
                  <p className="text-xs text-slate-400">Haz clic para cambiar el archivo</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100">
                    <CloudUpload className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-700 font-semibold">Arrastra tu archivo aquí</p>
                  <p className="text-xs text-slate-400">o selecciona desde tu equipo</p>
                  <div className="mt-1 px-3 py-1 rounded-lg text-xs bg-slate-100 text-slate-500 font-medium">
                    PDF, JPG, PNG — Máx. 10 MB
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 pb-6">
          <Button onClick={onClose} variant="outline" className="flex-1 py-3 font-medium rounded-xl border-slate-200 text-slate-700 text-sm transition-all hover:bg-slate-50 h-auto">Cancelar</Button>
          <Button onClick={handleSave} disabled={isSubmitting} className="flex-1 flex font-semibold items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-95 h-auto disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-br from-green-800 to-green-500 shadow-lg shadow-green-800/30">
            <CheckCircle className="w-4 h-4" /> {isSubmitting ? "Guardando..." : "Guardar documento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
