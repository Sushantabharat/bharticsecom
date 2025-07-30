import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModels'

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()
  const product = await ProductModel.findById(params.id)
  if (!product) {
    return Response.json(
      { message: 'product not found' },
      {
        status: 404,
      }
    )
  }
  return Response.json(product)
}) as any


export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  const {
    name,
    slug,
    price,
    category,
    image,
    type,
    brand,
    countInStock,
    description,
    variant,
    avilableColors,
  } = await req.json();

  try {
    await dbConnect();

    if (!Array.isArray(variant) || variant.length === 0) {
      return Response.json({ message: 'At least one variant is required' }, { status: 400 });
    }

    // Process each variant
    const processedVariants = variant.map((v) => {
      const exShowroom = Number(v?.exShowroomPrice || 0);
      const originalPrice = Number(v?.originalPrice || 0);
      const insurance = Number(v?.insurance || 0);
      const roadTax = Number(v?.roadtax || 0);
      const discount = Number(v?.discount || 0);

      if (
        isNaN(exShowroom) ||
        isNaN(insurance) ||
        isNaN(roadTax)
      ) {
        throw new Error('Invalid price fields in variant');
      }
      let onroadPrice = 0
      let onroadAfterDiscount = 0
      const tcs = exShowroom > 1000000 ? Math.round(exShowroom * 0.01) : 0;
      if (type === "NEW") {
        onroadPrice = exShowroom + insurance + roadTax + tcs;
        onroadAfterDiscount = onroadPrice - discount;
      }
      else if (type === "USED") {
        onroadPrice = originalPrice + insurance + roadTax + tcs;
        onroadAfterDiscount = onroadPrice - discount;
      }

      return {
        ...v,
        exShowroomPrice: exShowroom,
        originalPrice: originalPrice,
        insurance,
        roadtax: roadTax,
        discount,
        TCS: tcs,
        onroadPrice,
        onroadAfterDiscount,
        transmission: v.transmission,
        fuelType: v.fuelType,
        totalTrip: v.totalTrip || 0,
        model: v.model,
        name: v.name,
      };
    });

    const product = await ProductModel.findById(params.id);

    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    // Validate required fields
    if (!image) {
      return Response.json({ message: 'Image is required' }, { status: 400 });
    }

    product.name = name;
    product.slug = slug;
    product.price = Number(price);
    product.category = category;
    product.image = image;
    product.type = type;
    product.brand = brand?.toUpperCase();
    product.countInStock = Number(countInStock);
    product.description = description;
    product.avilableColors = avilableColors || [];
    product.variant = processedVariants;

    const updatedProduct = await product.save();

    return Response.json(updatedProduct);
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
}) as any;


export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }

  try {
    await dbConnect()
    const product = await ProductModel.findById(params.id)
    if (product) {
      await product.deleteOne()
      return Response.json({ message: 'Product deleted successfully' })
    } else {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
