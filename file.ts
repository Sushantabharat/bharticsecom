// export default function NewCarModelPage({ params }: { params: { carId: string } }) {
//   const model = getCarById(params.carId) as NewCarModel | undefined;
//   const { cartItem, addToCart, removeFromCart, isItemInCart } = useCart(); // Use cart context

//   const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(undefined);
//   const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

//   useEffect(() => {
//     if (model && model.type === 'new' && model.variants.length > 0) {
//       setSelectedVariantId(model.variants[0].id);
//       if (model.availableColors.length > 0) {
//         setSelectedColor(model.availableColors[0]);
//       }
//     }
//   }, [model]);

//   const selectedVariant = useMemo(() => {
//     if (!model || model.type !== 'new' || !selectedVariantId) return undefined;
//     return model.variants.find(v => v.id === selectedVariantId);
//   }, [model, selectedVariantId]);

//   const currentItemInCart = model && selectedVariant ? isItemInCart(model.id, selectedVariant.id) : false;
//   const anotherItemInCart = cartItem && !currentItemInCart;

//   const handleCartAction = () => {
//     if (!model || !selectedVariant) return;
//     if (currentItemInCart) {
//       removeFromCart();
//     } else {
//       addToCart(model, selectedVariant, selectedColor);
//     }
//   };

//   if (!model || model.type !== 'new') {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <CarIcon className="w-24 h-24 text-muted-foreground mb-4" />
//         <Alert variant="destructive" className="max-w-md text-center shadow-md">
//           <AlertTitle className="text-2xl">Car Model Not Found</AlertTitle>
//           <AlertDescription>
//             The new car model you are looking for does not exist or is not available.
//           </AlertDescription>
//         </Alert>
//         <Button asChild className="mt-6">
//           <Link href="/new-cars"><ArrowLeft className="mr-2 h-4 w-4" /> Back to New Cars</Link>
//         </Button>
//       </div>
//     );
//   }

//   let cartButtonText = "Add to Cart";
//   let cartButtonIcon = <ShoppingCart className="mr-2 h-5 w-5" />;
//   if (currentItemInCart) {
//     cartButtonText = "Remove from Cart";
//     cartButtonIcon = <Trash2 className="mr-2 h-5 w-5" />;
//   } else if (anotherItemInCart) {
//     cartButtonText = "Replace in Cart";
//     cartButtonIcon = <RefreshCw className="mr-2 h-5 w-5" />;
//   }

//   return (
//     <div className="space-y-8">
//       <div>
//         <Button variant="outline" asChild className="mb-6">
//           <Link href="/new-cars"><ArrowLeft className="mr-2 h-4 w-4" /> Back to New Cars</Link>
//         </Button>
//         <h1 className="text-3xl md:text-4xl font-bold">{model.brand} {model.modelName}</h1>
//         <p className="text-lg text-muted-foreground">Explore variants and colors for the {model.year} {model.modelName}.</p>
//       </div>

//       <div className="grid md:grid-cols-3 gap-8">
//         <div className="md:col-span-2 space-y-6">
//           <Card className="overflow-hidden shadow-xl">
//             <Image
//               src={selectedColor && model.images.find(img => img.alt.toLowerCase().includes(selectedColor.split(' ')[0].toLowerCase()))?.url || model.images[0]?.url || `https://placehold.co/800x500.png?text=${model.brand}+${model.modelName}`}
//               alt={selectedColor && model.images.find(img => img.alt.toLowerCase().includes(selectedColor.split(' ')[0].toLowerCase()))?.alt ||model.images[0]?.alt || `${model.brand} ${model.modelName}`}
//               width={800}
//               height={500}
//               className="w-full h-auto object-cover rounded-lg"
//               priority
//               data-ai-hint={model.images[0]?.hint || `${model.brand} ${model.modelName}`}
//             />
//           </Card>

//           <Card className="shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-xl">Choose Your Style</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <Label htmlFor="color-select" className="text-base font-medium mb-2 block">Select Color: <Badge variant="outline">{selectedColor || 'N/A'}</Badge></Label>
//                  {model.availableColors.length > 0 ? (
//                     <RadioGroup
//                       id="color-select"
//                       value={selectedColor}
//                       onValueChange={setSelectedColor}
//                       className="flex flex-wrap gap-3"
//                     >
//                       {model.availableColors.map((color) => (
//                         <RadioGroupItem key={color} value={color} id={`color-${color}`} className="sr-only" />
//                       ))}
//                       {model.availableColors.map((color) => (
//                          <Label
//                           key={color}
//                           htmlFor={`color-${color}`}
//                           className={cn(
//                             "flex items-center justify-center rounded-md border-2 p-3 hover:border-primary cursor-pointer transition-all text-sm",
//                             selectedColor === color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-muted"
//                           )}
//                           style={{backgroundColor: color.toLowerCase() === 'white' ? '#f8f8f8' : color.split(' ')[0].toLowerCase() }} // Basic color preview
//                         >
//                           <span className={cn("font-medium", (['black', 'blue', 'gray', 'grey', 'red', 'green'].some(c => color.toLowerCase().includes(c))) ? "text-white mix-blend-difference" : "text-black")}>{color}</span>
//                         </Label>
//                       ))}
//                     </RadioGroup>
//                   ) : <p className="text-sm text-muted-foreground">Color information not available.</p>}
//               </div>
//               <div>
//                 <Label htmlFor="variant-select" className="text-base font-medium mb-2 block">Select Variant:</Label>
//                 {model.variants.length > 0 ? (
//                   <Select value={selectedVariantId} onValueChange={setSelectedVariantId}>
//                     <SelectTrigger id="variant-select" className="w-full md:w-[300px]">
//                       <SelectValue placeholder="Select a variant" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {model.variants.map((variant) => (
//                         <SelectItem key={variant.id} value={variant.id}>
//                           {variant.name} ({variant.fuelType}, {variant.transmission}) - ₹{variant.priceDetails.finalPrice.toLocaleString()}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 ) : <p className="text-sm text-muted-foreground">Variant information not available.</p>}
//               </div>
//             </CardContent>
//           </Card>

//           {selectedVariant && (
//             <Card className="shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-xl">Variant: {selectedVariant.name}</CardTitle>
//                 <CardDescription>Key specifications for the selected variant.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
//                   <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
//                     <Fuel className="w-5 h-5 text-primary" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Fuel Type</p>
//                       <p className="font-medium">{selectedVariant.fuelType}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
//                     <Settings className="w-5 h-5 text-primary" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Transmission</p>
//                       <p className="font-medium">{selectedVariant.transmission}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
//                     <Palette className="w-5 h-5 text-primary" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Selected Color</p>
//                       <p className="font-medium">{selectedColor || 'N/A'}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-md">
//                     <CalendarDays className="w-5 h-5 text-primary" />
//                     <div>
//                       <p className="text-xs text-muted-foreground">Model Year</p>
//                       <p className="font-medium">{model.year}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {selectedVariant && selectedVariant.features && selectedVariant.features.length > 0 && (
//             <Card className="shadow-lg">
//               <CardHeader>
//                 <CardTitle className="text-xl">Features ({selectedVariant.name})</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                   {selectedVariant.features.map((feature, index) => (
//                     <li key={index} className="flex items-center">
//                       <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
//                       <span>{feature}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           )}

//           <Card className="shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-xl">Model Description</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-muted-foreground leading-relaxed">{model.description}</p>
//             </CardContent>
//           </Card>

//         </div>

//         <div className="md:col-span-1 space-y-6">
//           {selectedVariant ? (
//             <PriceBreakup priceDetails={selectedVariant.priceDetails} />
//           ) : (
//             <Card className="shadow-lg">
//               <CardHeader><CardTitle>Price Details</CardTitle></CardHeader>
//               <CardContent><p className="text-muted-foreground">Select a variant to see price details.</p></CardContent>
//             </Card>
//           )}
//           <Button
//             size="lg"
//             className={cn(
//                 "w-full text-lg shadow-md hover:shadow-lg transition-shadow",
//                 currentItemInCart && "bg-destructive hover:bg-destructive/90",
//                 anotherItemInCart && "bg-orange-500 hover:bg-orange-600"
//             )}
//             disabled={!selectedVariant}
//             onClick={handleCartAction}
//           >
//             {cartButtonIcon} {cartButtonText}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
