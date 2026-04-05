"use client"

import { useState } from "react"
import { MaterialCapsuleForm } from "./MaterialCapsuleForm"
import { MaterialCapsuleList } from "./MaterialCapsuleList"

interface Material {
  id: string
  title: string
  fileUrl: string
  chapterSession: string | null
  loreViews?: any[]
}

interface MaterialManagerProps {
  materials: Material[]
  classId: string
}

export function MaterialManager({ materials, classId }: MaterialManagerProps) {
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)

  return (
    <div className="grid gap-16 lg:grid-cols-12 items-start">
      {/* Left: Creation/Edit Portal */}
      <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-24">
         <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-foreground ml-2">
                {editingMaterial ? "Alchemy Portal (Edit)" : "Creation Portal"}
            </h2>
            <MaterialCapsuleForm 
                classId={classId} 
                editingMaterial={editingMaterial}
                onCancelEdit={() => setEditingMaterial(null)}
            />
         </div>
      </div>

      {/* Right: Existing Loot */}
      <div className="lg:col-span-7 space-y-10">
         <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-foreground ml-2">Deployed Capsules</h2>
            <MaterialCapsuleList 
                materials={materials} 
                classId={classId} 
                isTeacher 
                onEdit={setEditingMaterial}
            />
         </div>
      </div>
    </div>
  )
}
