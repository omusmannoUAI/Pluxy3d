"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, X, Plus, Eye, Save, Package, ImageIcon, Tag, DollarSign, Layers } from "lucide-react"
import Image from "next/image"
import ProductPreviewModal from "@/components/ProductPreviewModal"

export default function NewProductPage() {
  const router = useRouter()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Estado del producto
  const [product, setProduct] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    brand: "",
    sku: "",
    price: 0,
    originalPrice: 0,
    cost: 0,
    stock: 0,
    minStock: 5,
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    status: "active",
    featured: false,
    images: [],
    specifications: {},
    features: [],
    tags: [],
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  })

  // Estados para formularios
  const [newFeature, setNewFeature] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newSpecKey, setNewSpecKey] = useState("")
  const [newSpecValue, setNewSpecValue] = useState("")

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDimensionChange = (dimension, value) => {
    setProduct((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setProduct((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index) => {
    setProduct((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setProduct((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }))
      setNewSpecKey("")
      setNewSpecValue("")
    }
  }

  const removeSpecification = (key) => {
    setProduct((prev) => ({
      ...prev,
      specifications: Object.fromEntries(Object.entries(prev.specifications).filter(([k]) => k !== key)),
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProduct((prev) => ({
          ...prev,
          images: [...prev.images, event.target.result],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async (isDraft = false) => {
    setIsSaving(true)
    try {
      // Simular guardado
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Producto guardado:", { ...product, status: isDraft ? "draft" : product.status })

      // Redireccionar al admin
      router.push("/admin")
    } catch (error) {
      console.error("Error al guardar producto:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getPreviewProduct = () => ({
    ...product,
    rating: 4.5,
    reviewCount: 0,
    inStock: product.stock > 0,
    stockQuantity: product.stock,
    images: product.images.length > 0 ? product.images : ["/placeholder.svg?height=500&width=500"],
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
              <p className="text-gray-600">Crea un nuevo producto para tu tienda</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setIsPreviewOpen(true)} className="gap-2">
              <Eye className="h-4 w-4" />
              Vista Previa
            </Button>
            <Button variant="outline" onClick={() => handleSave(true)} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar Borrador
            </Button>
            <Button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="bg-purple-600 hover:bg-purple-700 gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Publicar Producto"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario principal */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="images">Imágenes</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              {/* Información General */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Información Básica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del producto *</Label>
                        <Input
                          id="name"
                          value={product.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Ej: Creality Ender 3 V2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU *</Label>
                        <Input
                          id="sku"
                          value={product.sku}
                          onChange={(e) => handleInputChange("sku", e.target.value)}
                          placeholder="Ej: CR-EN3V2-001"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shortDescription">Descripción corta</Label>
                      <Input
                        id="shortDescription"
                        value={product.shortDescription}
                        onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                        placeholder="Descripción breve para listados"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción completa *</Label>
                      <Textarea
                        id="description"
                        value={product.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Descripción detallada del producto"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría *</Label>
                        <Select
                          value={product.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="impresoras">Impresoras 3D</SelectItem>
                            <SelectItem value="componentes">Componentes</SelectItem>
                            <SelectItem value="filamentos">Filamentos</SelectItem>
                            <SelectItem value="herramientas">Herramientas</SelectItem>
                            <SelectItem value="accesorios">Accesorios</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Marca *</Label>
                        <Select value={product.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar marca" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="creality">Creality</SelectItem>
                            <SelectItem value="hellbot">Hellbot</SelectItem>
                            <SelectItem value="prusa">Prusa</SelectItem>
                            <SelectItem value="bambu">Bambu Lab</SelectItem>
                            <SelectItem value="anycubic">Anycubic</SelectItem>
                            <SelectItem value="elegoo">Elegoo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Precios e Inventario
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio de venta *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={product.price}
                          onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Precio original</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={product.originalPrice}
                          onChange={(e) => handleInputChange("originalPrice", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">Costo</Label>
                        <Input
                          id="cost"
                          type="number"
                          value={product.cost}
                          onChange={(e) => handleInputChange("cost", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock actual *</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minStock">Stock mínimo</Label>
                        <Input
                          id="minStock"
                          type="number"
                          value={product.minStock}
                          onChange={(e) => handleInputChange("minStock", Number.parseInt(e.target.value) || 0)}
                          placeholder="5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          value={product.weight}
                          onChange={(e) => handleInputChange("weight", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="length">Largo (cm)</Label>
                        <Input
                          id="length"
                          type="number"
                          value={product.dimensions.length}
                          onChange={(e) => handleDimensionChange("length", e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width">Ancho (cm)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={product.dimensions.width}
                          onChange={(e) => handleDimensionChange("width", e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Alto (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={product.dimensions.height}
                          onChange={(e) => handleDimensionChange("height", e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Características</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Agregar característica"
                        onKeyPress={(e) => e.key === "Enter" && addFeature()}
                      />
                      <Button onClick={addFeature} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {feature}
                          <button onClick={() => removeFeature(index)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Imágenes */}
              <TabsContent value="images" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Galería de Imágenes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600">Haz clic para subir imágenes o arrastra aquí</p>
                        <p className="text-sm text-gray-400">PNG, JPG, WEBP hasta 5MB cada una</p>
                      </label>
                    </div>

                    {product.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {product.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Producto ${index + 1}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            {index === 0 && <Badge className="absolute bottom-2 left-2 bg-purple-600">Principal</Badge>}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Especificaciones */}
              <TabsContent value="specs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Especificaciones Técnicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Nombre de la especificación"
                      />
                      <div className="flex gap-2">
                        <Input
                          value={newSpecValue}
                          onChange={(e) => setNewSpecValue(e.target.value)}
                          placeholder="Valor"
                          onKeyPress={(e) => e.key === "Enter" && addSpecification()}
                        />
                        <Button onClick={addSpecification} size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium">{key}:</span>
                            <span className="ml-2 text-gray-600">{value}</span>
                          </div>
                          <button onClick={() => removeSpecification(key)} className="text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Etiquetas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Agregar etiqueta"
                        onKeyPress={(e) => e.key === "Enter" && addTag()}
                      />
                      <Button onClick={addTag} size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="gap-1">
                          {tag}
                          <button onClick={() => removeTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO */}
              <TabsContent value="seo" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Optimización SEO</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">Título SEO</Label>
                      <Input
                        id="seoTitle"
                        value={product.seoTitle}
                        onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                        placeholder="Título optimizado para buscadores"
                      />
                      <p className="text-xs text-gray-500">{product.seoTitle.length}/60 caracteres recomendados</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">Descripción SEO</Label>
                      <Textarea
                        id="seoDescription"
                        value={product.seoDescription}
                        onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                        placeholder="Descripción meta para buscadores"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500">
                        {product.seoDescription.length}/160 caracteres recomendados
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoKeywords">Palabras clave</Label>
                      <Input
                        id="seoKeywords"
                        value={product.seoKeywords}
                        onChange={(e) => handleInputChange("seoKeywords", e.target.value)}
                        placeholder="palabra1, palabra2, palabra3"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Estado del Producto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={product.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Producto destacado</Label>
                  <Switch
                    id="featured"
                    checked={product.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-medium">${product.price.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{product.stock} unidades</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium">{product.category || "Sin definir"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Marca:</span>
                  <span className="font-medium">{product.brand || "Sin definir"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Imágenes:</span>
                  <span className="font-medium">{product.images.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estado:</span>
                  <Badge variant={product.status === "active" ? "default" : "secondary"}>
                    {product.status === "active" ? "Activo" : product.status === "draft" ? "Borrador" : "Inactivo"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de vista previa */}
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        product={getPreviewProduct()}
      />
    </div>
  )
}
