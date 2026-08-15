import { useState } from "react"
import { locations } from "@/constants"
import { Folder, Search, ChevronRight, ChevronLeft } from "lucide-react"
import useWindowStore from "#store/window"

export function FinderApp() {
  const [folderHistory, setFolderHistory] = useState<any[]>([])
  const openWindow = useWindowStore((state: any) => state.openWindow)
  
  const allLocations = Object.values(locations)
  
  const currentFolder = folderHistory.length > 0 ? folderHistory[folderHistory.length - 1] : null
  const displayItems = currentFolder ? currentFolder.children : allLocations

  const openItem = (item: any) => {
    if (item.kind === 'folder') {
      setFolderHistory(prev => [...prev, item])
      return
    }
    if (item.fileType === 'pdf') return openWindow('resume')
    if (item.fileType === 'txt') return openWindow('txtfile', item)
    if (item.fileType === 'img') return openWindow('imgfile', item)
    if (['fig', 'url'].includes(item.fileType) && item.href) return window.open(item.href, '_blank')
    openWindow(`${item.fileType} ${item.kind}` as any, item)
  }

  const navigateBack = () => {
    setFolderHistory(prev => prev.slice(0, -1))
  }

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col text-black">
      <div className="px-4 py-3 bg-white border-b sticky top-0 z-10 pt-10">
        <div className="flex items-center gap-2 mb-3">
          {currentFolder && (
            <button onClick={navigateBack} className="text-blue-500">
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-bold">{currentFolder ? currentFolder.name : "Files"}</h1>
        </div>
        {!currentFolder && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto pointer-events-auto">
        <div className="px-4 py-4">
          {!currentFolder && (
            <>
              <h2 className="text-xl font-bold mb-3 px-1">Locations</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 active:bg-gray-50 cursor-pointer">
                  <Folder className="text-blue-500 fill-blue-500/20" />
                  <span className="flex-1 font-medium">On My iPhone</span>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
                <div className="flex items-center gap-3 p-4 active:bg-gray-50 cursor-pointer">
                  <Folder className="text-blue-500 fill-blue-500/20" />
                  <span className="flex-1 font-medium">iCloud Drive</span>
                  <ChevronRight className="text-gray-400" size={20} />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-3 px-1">Favorites</h2>
            </>
          )}
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {displayItems?.map((item: any, idx: number) => (
              <div 
                key={item.id}
                className={`flex items-center gap-3 p-4 ${idx !== displayItems.length - 1 ? 'border-b border-gray-100' : ''} active:bg-gray-50 cursor-pointer pointer-events-auto`}
                onClick={() => openItem(item)}
              >
                {item.kind === 'folder' ? (
                  <Folder className="text-blue-500 fill-blue-500/20" />
                ) : (
                  <img src={item.icon} alt={item.name} className="w-6 h-6 object-contain" />
                )}
                <div className="flex-1">
                  <span className="font-medium">{item.name}</span>
                  {item.fileType && <p className="text-xs text-gray-400 mt-0.5">{item.fileType.toUpperCase()} {item.kind === 'folder' ? 'Folder' : 'File'}</p>}
                </div>
                {item.kind === 'folder' && <ChevronRight className="text-gray-400" size={20} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
