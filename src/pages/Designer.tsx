import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Image as ImageIcon, Download, RotateCcw, MousePointer2, Layout as LayoutIcon, Settings2 } from 'lucide-react'
import { Toast } from '../components/Toast'
import { ToolButton } from '../components/ToolButton'
import { PropertiesPanel } from '../components/PropertiesPanel'
import { LayersPanel } from '../components/LayersPanel'
import { Tshirt3D } from '../components/Tshirt3D'
import { ControlPanel } from '../components/ControlPanel'
import type { DesignElement as IDesignElement } from '../types/designer'

import type { KonvaEventObject } from 'konva/lib/Node'
import Konva from 'konva'

const TSHIRT_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'

interface URLImageProps {
  url: string
  [key: string]: unknown
}

const URLImage = ({ url, ...props }: URLImageProps) => {
  const [img] = useImage(url, 'anonymous')
  return <KonvaImage image={img} {...props} />
}

interface DesignElementProps {
  shapeProps: IDesignElement
  isSelected: boolean
  onSelect: () => void
  onChange: (newAttrs: Partial<IDesignElement>) => void
}

const DesignElement = ({ shapeProps, isSelected, onSelect, onChange }: DesignElementProps) => {
  const textRef = useRef<Konva.Text>(null)
  const imageRef = useRef<Konva.Image>(null)
  const trRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (isSelected && trRef.current) {
      const node = shapeProps.type === 'text' ? textRef.current : imageRef.current
      if (node) {
        trRef.current.nodes([node])
        trRef.current.getLayer()?.batchDraw()
      }
    }
  }, [isSelected, shapeProps.type])

  const handleTransformEnd = () => {
    const node = shapeProps.type === 'text' ? textRef.current : imageRef.current
    if (!node) return

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // reset scale
    node.scaleX(1)
    node.scaleY(1)

    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  return (
    <>
      {shapeProps.type === 'text' ? (
        <Text
          onClick={onSelect}
          onTap={onSelect}
          ref={textRef}
          {...shapeProps}
          draggable
          onDragEnd={(e) => {
            onChange({
              x: e.target.x(),
              y: e.target.y(),
            })
          }}
          onTransformEnd={handleTransformEnd}
        />
      ) : (
        <URLImage
          onClick={onSelect}
          onTap={onSelect}
          ref={imageRef}
          {...shapeProps}
          url={shapeProps.url || ''}
          draggable
          onDragEnd={(e: KonvaEventObject<DragEvent>) => {
            onChange({
              x: e.target.x(),
              y: e.target.y(),
            })
          }}
          onTransformEnd={handleTransformEnd}
        />
      )}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

export const Designer = () => {
  const [elements, setElementsState] = useState<IDesignElement[]>([])
  const [history, setHistory] = useState<IDesignElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'2d' | '3d'>('2d')
  const [textureUrl, setTextureUrl] = useState<string | undefined>()
  const [showMockup, setShowMockup] = useState(true)
  
  const [toast, setToast] = useState({ show: false, message: '' })
  const [shirtImage] = useImage(TSHIRT_IMAGE, 'anonymous')
  
  const stageRef = useRef<Konva.Stage>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync texture for 3D view
  useEffect(() => {
    if (view === '3d') {
      updateTexture()
    }
  }, [view, elements])

  const updateTexture = () => {
    if (!stageRef.current) return
    
    // Temporarily hide mockup and selection for clean texture
    const prevSelectedId = selectedId
    setSelectedId(null)
    setShowMockup(false)

    // Wait for render
    setTimeout(() => {
      try {
        if (stageRef.current) {
          const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
          setTextureUrl(uri)
        }
      } catch (err) {
        console.warn('Could not capture canvas texture:', err)
      }
      setShowMockup(true)
      setSelectedId(prevSelectedId)
    }, 50)
  }

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nameless-design')
    if (saved) {
      const parsed = JSON.parse(saved)
      setElementsState(parsed)
      setHistory([parsed])
      setHistoryIndex(0)
    }
  }, [])

  // Save to localStorage when elements change
  useEffect(() => {
    localStorage.setItem('nameless-design', JSON.stringify(elements))
  }, [elements])

  // Custom setElements that updates history
  const setElements = (newElements: IDesignElement[] | ((prev: IDesignElement[]) => IDesignElement[]), skipHistory = false) => {
    const nextElements = typeof newElements === 'function' ? newElements(elements) : newElements
    setElementsState(nextElements)
    
    if (!skipHistory) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(nextElements)
      // Keep last 50 steps
      if (newHistory.length > 50) newHistory.shift()
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const undo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1
      setElementsState(history[nextIndex])
      setHistoryIndex(nextIndex)
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      setElementsState(history[nextIndex])
      setHistoryIndex(nextIndex)
    }
  }

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) redo()
        else undo()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if we're not in an input
        if (selectedId && e.target instanceof HTMLElement && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          deleteElement(selectedId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [historyIndex, history, selectedId])

  const selectedElement = elements.find(el => el.id === selectedId)

  const addText = () => {
    const id = Math.random().toString(36).substr(2, 9)
    const newElement: IDesignElement = { 
      id, 
      type: 'text', 
      text: 'New Text', 
      x: 150, 
      y: 150, 
      width: 100, 
      height: 30, 
      fontSize: 24, 
      fill: '#ffffff', 
      rotation: 0 
    }
    setElements([...elements, newElement])
    setSelectedId(id)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const id = Math.random().toString(36).substr(2, 9)
        const newElement: IDesignElement = { 
          id, 
          type: 'image', 
          url: reader.result as string, 
          x: 100, 
          y: 100, 
          width: 150, 
          height: 150, 
          rotation: 0 
        }
        setElements([...elements, newElement])
        setSelectedId(id)
      }
      reader.readAsDataURL(file)
    }
  }

  const updateElement = (id: string, newAttrs: Partial<IDesignElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...newAttrs } : el))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    setSelectedId(null)
  }

  const handleExport = () => {
    if (!stageRef.current) return
    
    // Deselect before export for a clean look
    setSelectedId(null)
    
    // Small timeout to allow transformer to disappear
    setTimeout(() => {
      const stage = stageRef.current
      if (!stage) return
      
      const uri = stage.toDataURL({ pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = 'nameless-design.png'
      link.href = uri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setToast({ show: true, message: 'Design exported successfully!' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Top Header / Toolbar */}
      <header className="h-16 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
            <LayoutIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-white uppercase">Nameless Studio <span className="text-red-500 ml-1">Pro</span></h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Project: Untitled Concept</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-white text-black hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" /> Export Design
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-20 border-r border-white/5 bg-slate-900/30 backdrop-blur-xl flex flex-col items-center py-6 gap-6">
          <div className="space-y-4 w-full px-3">
             <ToolButton 
                icon={Type} 
                label="Text" 
                onClick={addText} 
              />
              <ToolButton 
                icon={ImageIcon} 
                label="Media" 
                onClick={() => fileInputRef.current?.click()} 
              />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
          </div>

          <div className="mt-auto space-y-4 w-full px-3">
            <ToolButton 
              icon={RotateCcw} 
              label="Reset" 
              onClick={() => setElements([])} 
            />
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-12 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {view === '2d' ? (
              <motion.div 
                key="2d"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group"
              >
                <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5">
                  <Stage
                    width={400}
                    height={500}
                    ref={stageRef}
                    onMouseDown={(e) => {
                      const clickedOnEmpty = e.target === e.target.getStage()
                      if (clickedOnEmpty) setSelectedId(null)
                    }}
                  >
                    <Layer>
                      {shirtImage && showMockup && (
                        <KonvaImage
                          image={shirtImage}
                          width={400}
                          height={500}
                          opacity={1}
                        />
                      )}
                      {elements.map((el) => (
                        <DesignElement
                          key={el.id}
                          shapeProps={el}
                          isSelected={el.id === selectedId}
                          onSelect={() => setSelectedId(el.id)}
                          onChange={(newAttrs) => updateElement(el.id, newAttrs)}
                        />
                      ))}
                    </Layer>
                  </Stage>
                </div>
                <div className="absolute -top-6 left-0 text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  Canvas / 400x500px
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="3d"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full h-full max-w-4xl max-h-[700px]"
              >
                <Tshirt3D textureUrl={textureUrl} />
              </motion.div>
            )}
          </AnimatePresence>

          <ControlPanel 
            view={view}
            onViewChange={setView}
            onUndo={undo}
            onRedo={redo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />
        </main>

        {/* Right Sidebar - Properties & Layers */}
        <aside className="w-80 border-l border-white/5 bg-slate-900/30 backdrop-blur-xl flex flex-col p-6 gap-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {selectedElement ? (
              <PropertiesPanel 
                key={selectedElement.id}
                element={selectedElement}
                onChange={(newAttrs) => updateElement(selectedElement.id, newAttrs)}
                onDelete={() => deleteElement(selectedElement.id)}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-950/50 border border-slate-800 p-8 rounded-3xl flex flex-col items-center text-center space-y-4"
              >
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-slate-700">
                  <MousePointer2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-bold">Select Element</h3>
                  <p className="text-slate-500 text-xs mt-1">Pick a layer on the canvas or list to begin editing.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <LayersPanel 
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={deleteElement}
          />
        </aside>
      </div>

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  )
}
