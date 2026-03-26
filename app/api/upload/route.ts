import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const images = formData.getAll('images') as File[];

    // 1. Validation
    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'សូមជ្រើសរើសរូបភាព (Please provide images).' },
        { status: 400 }
      );
    }

    // 2. Process and Upload to Cloudinary
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert to Base64 for Cloudinary
        const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
        
        // Upload to a specific folder named 'wedding-service'
        return uploadImage(base64Image, 'wedding-service');
      })
    );

    // 3. Return the URLs to be saved in your Product database
    return NextResponse.json(
      {
        success: true,
        message: 'Images uploaded successfully!',
        data: {
          urls: imageUrls, // Use these URLs in your Product Create API
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload images.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}