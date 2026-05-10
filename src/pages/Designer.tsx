import { useState, useRef } from 'react'
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'
import { motion } from 'framer-motion'
import { Type, Image as ImageIcon, Download, RotateCcw } from 'lucide-react'
import { Toast } from '../components/Toast'

const TSHIRT_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'

const DesignElement = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
  const shapeRef = useRef<any>(null)
  const trRef = useRef<any>(null)

  useState(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  })

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
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            })
          }}
          onTransformEnd={() => {
            const node = shapeRef.current
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()
            node.scaleX(1)
            node.scaleY(1)
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            })
          }}
        />
      ) : (
        <URLImage
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          draggable
          onDragEnd={(e: any) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            })
          }}
          onTransformEnd={() => {
            const node = shapeRef.current
            const scaleX = node.scaleX()
            const scaleY = node.scaleY()
            node.scaleX(1)
            node.scaleY(1)
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            })
          }}
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

const URLImage = ({ url, ...props }: any) => {
  const [img] = useImage(url)
  return <KonvaImage image={img} {...props} />
}

export const Designer = () => {
  const [elements, setElements] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [toast, setToast] = useState({ show: false, message: '' })
  const [shirtImage] = useImage(TSHIRT_IMAGE)

  const addText = () => {
    const id = Math.random().toString(36).substr(2, 9)
    setElements([...elements, { id, type: 'text', text: 'New Text', x: 150, y: 150, fontSize: 20, fill: '#ffffff' }])
    setSelectedId(id)
  }

  const handleExport = () => {
    setToast({ show: true, message: 'Design exported successfully!' })
    setTimeout(() => setToast({ ...toast, show: false }), 3000)
  }

  return (
    <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Custom Studio</h1>
        <p className="text-slate-400 font-medium">Bring your vision to life on our premium canvas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Toolbar - Ordered second on mobile */}
        <div className="col-span-1 space-y-6 order-2 lg:order-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Tools</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={addText}
                className="flex flex-col items-center justify-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-red-500 transition-all gap-2 group"
              >
                <Type className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-300">Add Text</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-red-500 transition-all gap-2 group">
                <ImageIcon className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-300">Add Image</span>
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95"
              >
                <Download className="w-5 h-5" /> Download Design
              </button>
              <button
                onClick={() => setElements([])}
                className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-slate-700 hover:border-red-500 text-white py-4 rounded-2xl font-bold transition-all active:scale-95"
              >
                <RotateCcw className="w-5 h-5" /> Reset Canvas
              </button>
            </div>
          </motion.div>
        </div>

        {/* Canvas Area - Ordered first on mobile */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="col-span-1 lg:col-span-2 order-1 lg:order-2"
        >
          <div className="bg-slate-900 p-4 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden flex justify-center items-center relative min-h-[500px] lg:min-h-[600px]">
             {/* Konva Stage */}
             <div className="relative w-full max-w-[400px] aspect-[4/5]">
               <Stage
                width={400}
                height={500}
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
                  {elements.map((el, i) => (
                    <DesignElement
                      key={el.id}
                      shapeProps={el}
                      isSelected={el.id === selectedId}
                      onSelect={() => setSelectedId(el.id)}
                      onChange={(newAttrs: any) => {
                        const newElems = elements.slice()
                        newElems[i] = newAttrs
                        setElements(newElems)
                      }}
                    />
                  ))}
                </Layer>
              </Stage>
             </div>
          </div>
        </motion.div>
      </div>

      <Toast 
        message={toast.message} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  )
}
