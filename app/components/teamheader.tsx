import { useState } from 'react';
import { Button } from './UI/button';
import { messages } from '../i18n/messages';

interface TeamHeaderProps {
    t: any;
    active: 'managers' | 'ourTeam';
    setActive: (val: 'managers' | 'ourTeam') => void;
}

export const TeamHeader = ({ t, active, setActive }: TeamHeaderProps) => {
    return (
        <div className="flex gap-4 p-10 justify-center">
            <Button
            variant={active === 'managers' ? 'gold' : 'ghost'}
            onClick={() => setActive('managers')}
            className="min-w-[120px]"
            >
                {t.managers}
            </Button>
            <Button
            variant={active === 'ourTeam' ? 'gold' : 'ghost'}
            onClick={() => setActive('ourTeam')}
            className="min-w-[120px]"
            >
                {t.OurTeam}
            </Button>
        </div>
    )
}
