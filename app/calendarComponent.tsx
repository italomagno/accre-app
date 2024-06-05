"use client"
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from 'react-day-picker';

// ...
export function CalendarComponent() {
    const [numberOfMonths, setNumberOfMonths] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false); // New state variable for dialog

    const handleDayClick = (day: Date) => {
        if (day) {
            // Open the menu when a day is selected
            setIsMenuOpen(true);
            setIsDialogOpen(true); // Open the dialog
        }
    };

    // ...

    return (
        <>
            <Calendar
                mode='default'
                styles={{
                    months: { 
                    fontSize: "1.5rem",
                    lineHeight: "2rem"
                    },
                    row: { 
                    
                    fontSize: "1.5rem",
                    lineHeight: "2rem",
                        
                },
                    head_cell: { width: "70px",
                    height: "50px",
                    fontSize: "1.5rem",
                    lineHeight: "2rem"
                     },
                    cell: { width: "70px",
                    height: "75px",

                     },
                }}
                onDayKeyPress={ ()=><DialogTrigger >
                  </DialogTrigger>}
                onDayClick={handleDayClick}
                // ...
            />

        </>
    );
}
