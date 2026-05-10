import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Image as ImageIcon, Download, RotateCcw, MousePointer2 } from 'lucide-react'
import { Toast } from '../components/Toast'
import { ToolButton } from '../components/ToolButton'
import { PropertiesPanel } from '../components/PropertiesPanel'
import type { DesignElement as IDesignElement } from '../types/designer'

const TSHIRT_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'

interface URLImageProps {
  url: string
  [key: string]: any
}

const URLImage = ({ url, ...props }: URLImageProps) => {
  const [img] = useImage(url)
  return <KonvaImage image={img} {...props} />
}

interface DesignElementProps {
  shapeProps: IDesignElement
  isSelected: boolean
  onSelect: () => void
  onChange: (newAttrs: Partial<IDesignElement>) => void
}

const DesignElement = ({ shapeProps, isSelected, onSelect, onChange }: DesignElementProps) => {
  const shapeRef = useRef<any>(null)
  const trRef = useRef<any>(null)

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  const handleTransformEnd = () => {
    const node = shapeRef.current
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
      height: Math.max(node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  return (
    <>
      {shapeProps.type === 'text' ? (
        <Text
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
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
          ref={shapeRef}
          {...shapeProps}
          url={shapeProps.url || ''}
          draggable
          onDragEnd={(e: any) => {
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
  const [elements, setElements] = useState<IDesignElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [shirtImage] = useImage(TSHIRT_IMAGE)
  
  const stageRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
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
    <div className="py-24 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Studio One</h1>
        <p className="text-slate-500 font-medium tracking-wide">High-fidelity customization for the nameless generation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar - Tools */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/50 backdrop-blur-xl p-4 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Design Tools</h3>
            <div className="space-y-3">
              <ToolButton 
                icon={Type} 
                label="Add Text" 
                onClick={addText} 
              />
              <ToolButton 
                icon={ImageIcon} 
                label="Add Image" 
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
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl p-4 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">Global Actions</h3>
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95"
              >
                <Download className="w-5 h-5" /> Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setElements([])}
                className="w-full flex items-center justify-center gap-2 bg-transparent border border-slate-700 hover:border-red-500 text-white py-4 rounded-2xl font-bold transition-all active:scale-95"
              >
                <RotateCcw className="w-5 h-5" /> Reset
              </motion.button>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden flex justify-center items-center relative min-h-[600px]"
          >
             <div className="relative shadow-2xl rounded-2xl overflow-hidden bg-white/5">
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
                  {shirtImage && (
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

             {/* Canvas Guidelines */}
             <div className="absolute top-8 left-8 text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] pointer-events-none">
               Active Workspace / 400x500
             </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="lg:col-span-3">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-900/30 backdrop-blur-sm border border-dashed border-slate-800 p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                  <MousePointer2 className="w-8 h-8 text-slate-700" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">No Selection</h3>
                  <p className="text-slate-500 text-sm">Select an element on the canvas to modify its properties.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  )
}
