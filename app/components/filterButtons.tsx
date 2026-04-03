import React from 'react';
import { Button } from './UI/button';

interface FilterButtonsProps {
    activeFilter: 'all' | 'factory' | 'food' | 'both';
    setActiveFilter: (filter: 'all' | 'factory' | 'food' | 'both') => void;
    t: any;
}

export const FilterButtons = ({ activeFilter, setActiveFilter, t }: FilterButtonsProps) => {
    // Helper function to handle the styling logic exactly as you wrote it
    const getButtonStyle = (id: 'all' | 'factory' | 'food' | 'both') => {
        const isActive = activeFilter === id;
        return `
            border-2 border-[#B99808] px-10 py-3 font-bold transition-all uppercase text-sm
            ${isActive
                ? 'bg-[#B99808] text-white'
                : 'bg-[#2d1212]/50 text-[#B99808] hover:bg-[#B99808] hover:text-white'
            }`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mt-6">
            <Button
                variant={activeFilter === 'all' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('all')}
                className={getButtonStyle('all')}
            >
                {t.all}
            </Button>
            <Button
                variant={activeFilter === 'factory' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('factory')}
                className={getButtonStyle('factory')}
            >
                {t.factory}
            </Button>
            <Button
                variant={activeFilter === 'food' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('food')}
                className={getButtonStyle('food')}
            >
                {t.food}
            </Button>
            <Button
                variant={activeFilter === 'both' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('both')}
                className={getButtonStyle('both')}
            >
                {t.both}
            </Button>
        </div>
    );
};

export default FilterButtons;