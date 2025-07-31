"use client";

import { Trash2 } from "lucide-react";

interface Document {
  id: number;
  name: string;
  category: string;
  createdOn: string;
  nature: string;
  fileName: string;
  filedDate: string;
  assYear: string;
  software: string;
  dms: string;
}

interface DocumentsListProps {
  documents: Document[];
  activeDocument: number | null;
  onDocumentSelect: (docId: number) => void;
  onDelete: (docId: number) => void;
  selectedTab: string;
}

export default function DocumentsList({
  documents,
  activeDocument,
  onDocumentSelect,
  onDelete,
  selectedTab,
}: DocumentsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 text-white text-center py-4">
        <h2 className="text-lg font-bold">{selectedTab} Department - Documents List</h2>
      </div>

      {/* Document Selection Dropdown */}
      {documents.length > 0 && (
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-slate-700">
              Select Document to Work With:
            </label>
            <select
              value={activeDocument || ""}
              onChange={(e) => {
                const docId = e.target.value ? parseInt(e.target.value) : null;
                if (docId) {
                  onDocumentSelect(docId);
                }
              }}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">-- Select a document --</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.nature}) - {doc.createdOn}
                </option>
              ))}
            </select>
            {activeDocument && (
              <button
                onClick={() => onDocumentSelect(0)}
                className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
              >
                Clear
              </button>
            )}
          </div>
          {activeDocument && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
              ✓ Selected: {documents.find(d => d.id === activeDocument)?.name} - Ready for operations
            </div>
          )}
        </div>
      )}

      {/* Document Table */}
      <div className="p-4">
        <div className="border border-slate-200 rounded-md overflow-hidden">
          <div className="bg-blue-50 grid grid-cols-9 gap-1 p-3 text-xs font-semibold text-slate-900 border-b border-slate-200">
            <div>Select</div>
            <div>Created on</div>
            <div>Nature</div>
            <div>File Name</div>
            <div>Filed Date</div>
            <div>A.Y.</div>
            <div>Software</div>
            <div>DMS</div>
            <div>Actions</div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="h-40 bg-slate-50 flex items-center justify-center">
                <p className="text-slate-500 text-sm">
                  No documents available. Create documents by selecting from Form Categories.
                </p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`grid grid-cols-9 gap-1 p-3 text-xs border-b border-slate-100 transition-colors ${
                    activeDocument === doc.id 
                      ? "bg-blue-100 border-blue-300" 
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <input
                      type="radio"
                      name="selectedDocument"
                      checked={activeDocument === doc.id}
                      onChange={() => onDocumentSelect(doc.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                  <div>{doc.createdOn}</div>
                  <div>{doc.nature}</div>
                  <div className="truncate" title={doc.fileName}>
                    {doc.fileName}
                    {activeDocument === doc.id && (
                      <span className="ml-1 bg-green-500 text-white px-1 rounded text-xs">
                        Active
                      </span>
                    )}
                  </div>
                  <div>{doc.filedDate || "-"}</div>
                  <div>{doc.assYear}</div>
                  <div>{doc.software}</div>
                  <div>{doc.dms}</div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onDelete(doc.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
