import { title } from 'process';
import React from 'react';
import { useState } from 'react';
import { messages } from '../i18n/messages';

interface EventCardProps {
    image: string[];
    title: string;
    provider: string;
    price: string;
    capacity: string | number;
    t: any;
    active: 'all' | 'factory' | 'food' | 'both';
    setActive: (val: 'all' | 'factory' | 'food' | 'both') => void;
}

const t = messages['en']; // Default language, can be dynamic based on user selection

const CardItem = ({ image, title, provider, price, capacity }: EventCardProps) => {
    const [isMultiImage, setIsMultiImage] = useState(false);
    return (
        <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full">
            {/*Image container*/}
            <div className="relative h-48 w-full overflow-hidden">
                {isMultiImage ? (
                    //single image layout
                    <img
                src={image[0]}
                alt={title}
                className="w-full h-full object-cover"
                />
                ) : (
                    //two image layout
                    <div className="flex h-full w-full gap-0.5">
                        <div className="w-1/2 h-full">
                        <img src={image[0]} alt="Left" className="w-full h-full object-cover"/>
                        </div>
                        <div className="w-1/2 h-full">
                        <img src={image[1]} alt="Right" className="w-full h-full object-cover"/>
                        </div>
                    </div>
                )}
            </div>
                {/*content section */}
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-gray-600 mb-1">{t.from}</p>

                    <div className="text-[#B8860B] text-2xl font-bold mb-4">
                        ${price}
                    </div>
                    <div className="mt-auto">
                        <button className="w-full py-2 border border-[#B8860B] text-[#B8860B] rounded-md text-sm font-medium hover:bg-[#B8860B] hover:text-white transition-colors">
                            {t.for}
                        </button>
                    </div>
                </div>
            </div>
    );
};

//Main page container
const FactoryWeddingPage = () => {
    const cardData = [
        {
            title: "សេវាកម្មរោង និងអាពាហ៍ពិពាហ៍",
            provider: "សុខជា ធាវី",
            price: "500",
            capacity: "100",
            isMultiImage: false,
            image: [
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop",]
        },
        {
            title: "កញ្ចប់អាហារ និងការតុបតែង",
            provider: "សុខជា ធាវី",
            price: "1,500",
            capacity: "250",
            isMultiImage: true,
            image: [
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2000&auto=format&fit=crop"
            ]
        }
    ];

    return (
        <div className="bg-[#412525] p-10 min-h-screen flex justify-center items-start gap-8">
            {cardData.map((data, index) => (
                <CardItem t={undefined} active={'all'} setActive={function (val: 'all' | 'factory' | 'food' | 'both'): void {
                    throw new Error('Function not implemented.');
                } } key={index} {...data} />
            ))}
        </div>
    );
};

export default FactoryWeddingPage;