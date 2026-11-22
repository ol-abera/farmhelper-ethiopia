export function FileUpload({ onFile }: { onFile: (f: File) => void }) {
  return (
    <label className="block text-sm">
      <span>Attachment (pdf, doc, ppt, xls, png, jpg — max 10 MB)</span>
      <input
        type="file"
        className="mt-1 block w-full"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </label>
  );
}
