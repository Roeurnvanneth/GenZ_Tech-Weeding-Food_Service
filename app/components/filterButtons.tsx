import React from 'react';
import { Button } from './UI/button';

interface FilterButtons{
    activeFilter: 'all' | 'factory' | 'food' | 'both';
    setActiveFilter: (filter: 'all' | 'factory' | 'food' | 'both') => void;
    t: any;
}

export const FilterButtons = ({ activeFilter, setActiveFilter, t }: FilterButtons) => {
    //help function to handle the styleing logic to keep the code clean
    const getButtonStyle = (id: 'all' | 'factory' | 'food' | 'both') => {
        const isActive = activeFilter === id;
        return `
            border-2 border-[#B99808] px-10 py-3 font-bold transition-all uppercanse text-sm
            ${isActive
                ? 'bg-[#B99808] text-[#333333]'
                : 'bg-[#2d1212]/50 text-[#333333] hover:bg-[#B99808] hover:text-white'
            }`;
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mt-6">
            {/*All Button */}
            <Button
                variant={activeFilter === 'all' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('all')}
                className={getButtonStyle('all')}
                >
                {t.all}
            </Button>
            {/*All factory */}
            <Button
                variant={activeFilter === 'factory' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('factory')}
                className={getButtonStyle('factory')}
                >
                {t.factory}
            </Button>
            {/*All food */}
            <Button
                variant={activeFilter === 'food' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('food')}
                className={getButtonStyle('food')}
                >
                {t.food}
            </Button>
            {/*All both */}
            <Button
                variant={activeFilter === 'both' ? 'gold' : 'ghost'}
                onClick={() => setActiveFilter('both')}
                className={getButtonStyle('both')}
                >
                {t.both}
            </Button>
        </div>
    )
};

export default FilterButtons;