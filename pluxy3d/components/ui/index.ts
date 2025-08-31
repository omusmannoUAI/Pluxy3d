// Barrel exports optimizados para componentes UI más usados
// Esto reduce el bundle size al permitir tree-shaking automático

// Componentes más utilizados (alta prioridad)
export { Button } from "./button"
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
export { Input } from "./input"
export { Label } from "./label"
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

// Componentes moderadamente utilizados (media prioridad)
export { Separator } from "./separator"
export { Skeleton } from "./skeleton"
export { Badge } from "./badge"

// Componentes poco utilizados (baja prioridad - lazy load si es necesario)
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog"
export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu"
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form"
export { Popover, PopoverContent, PopoverTrigger } from "./popover"

// Componentes raramente utilizados (muy baja prioridad)
// export { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"
// export { Alert, AlertDescription, AlertTitle } from "./alert"
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog"
// export { AspectRatio } from "./aspect-ratio"
// export { Avatar, AvatarFallback, AvatarImage } from "./avatar"
// export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb"
// export { Calendar } from "./calendar"
// export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "./carousel"
// export { ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"
export { Checkbox } from "./checkbox"
// export { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible"
// export { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "./command"
// export { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuTrigger } from "./context-menu"
// export { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card"
// export { Menubar, MenubarCheckboxItem, MenubarContent, MenubarItem, MenubarLabel, MenubarMenu, MenubarRadioGroup, MenubarRadioItem, MenubarSeparator, MenubarShortcut, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarTrigger } from "./menubar"
// export { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuViewport } from "./navigation-menu"
// export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./pagination"
export { Progress } from "./progress"
export { RadioGroup, RadioGroupItem } from "./radio-group"
// export { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./resizable"
// export { ScrollArea, ScrollBar } from "./scroll-area"
// export { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet"
export { Slider } from "./slider"
export { Switch } from "./switch"
// export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table"
export { Textarea } from "./textarea"
// export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast"
// export { Toggle } from "./toggle"
// export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
