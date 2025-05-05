"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, ImageIcon, File, FileText, Video, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FileUploaderProps {
  onFileSelect: (files: string[]) => void
  onClose: () => void
}

export default function FileUploader({ onFileSelect, onClose }: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  // In a real app, this would handle actual file uploads
  // For this demo, we'll use placeholder images
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Simulate file upload with placeholder images
    const newFiles = Array.from(
      { length: e.target.files?.length || 0 },
      (_, i) => `/placeholder.svg?height=${300 + i}&width=${300 + i}`,
    )
    setSelectedFiles((prev) => [...prev, ...newFiles])
  }

  const handleConfirm = () => {
    onFileSelect(selectedFiles)
    onClose()
  }

  return (
    <div className="p-3 bg-white border-t border-[#e9edef]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-[#111b21]">Attach files</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-[#54656f] hover:bg-[#f0f2f5]">
          <X size={18} />
        </Button>
      </div>

      <Tabs defaultValue="gallery">
        <TabsList className="grid grid-cols-5 mb-4 bg-[#f0f2f5] p-1 rounded-md">
          <TabsTrigger
            value="gallery"
            className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a884]"
          >
            <ImageIcon size={20} />
            <span className="text-xs">Gallery</span>
          </TabsTrigger>
          <TabsTrigger
            value="document"
            className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a884]"
          >
            <FileText size={20} />
            <span className="text-xs">Document</span>
          </TabsTrigger>
          <TabsTrigger
            value="camera"
            className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a884]"
          >
            <Video size={20} />
            <span className="text-xs">Camera</span>
          </TabsTrigger>
          <TabsTrigger
            value="audio"
            className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a884]"
          >
            <Music size={20} />
            <span className="text-xs">Audio</span>
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="flex flex-col items-center gap-1 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00a884]"
          >
            <File size={20} />
            <span className="text-xs">Contact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-0">
          <div className="grid grid-cols-3 gap-2 mb-4 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative aspect-square bg-[#f0f2f5] rounded overflow-hidden">
                <img src={file || "/placeholder.svg"} alt="Selected" className="w-full h-full object-cover" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 w-6 h-6 rounded-full p-0"
                  onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
            <label className="aspect-square bg-[#f0f2f5] rounded flex flex-col items-center justify-center cursor-pointer hover:bg-[#e9edef]">
              <Upload size={24} className="mb-1 text-[#54656f]" />
              <span className="text-xs text-[#54656f]">Upload</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </TabsContent>

        {/* Other tabs would have similar content */}
        <TabsContent value="document">
          <div className="p-8 text-center text-[#54656f]">
            <FileText size={40} className="mx-auto mb-2" />
            <p>Select documents to share</p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleConfirm}
          disabled={selectedFiles.length === 0}
          className="bg-[#00a884] hover:bg-[#017561] text-white"
        >
          Send
        </Button>
      </div>
    </div>
  )
}
