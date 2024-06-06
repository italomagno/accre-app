'use client'
import { Calendar } from '@/components/ui/calendar';
import { DialogHeader } from '@/components/ui/dialog';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { generateUniqueKey } from '@/lib/utils';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@radix-ui/react-navigation-menu';
import Link from 'next/link';
import { optionsProps } from 'types';





export  function CalendarComponent({proposal,options}:{proposal:string,options:optionsProps[]
}
) {

 
    
    function handleProposal(DayOfMonth:number){
        const proposals = proposal? proposal.split(",") : [];
        const matchingProposal = proposals.find((prop: any) => {
        const [day, shift] = prop.split(":");
        return day === DayOfMonth.toString();
      });
      return matchingProposal ? matchingProposal.split(":")[1] : "-";
      }

    return (
        <>
            <Calendar
                mode='default'
                className='text-lg'
                styles={{
                    months: { 
                        fontSize: "1.5rem",
                        lineHeight: "2rem"
                    },
                    row: { 
                        fontSize: "1.5rem",
                        lineHeight: "2rem",
                    },
                    head_cell: { 
                        width: "50px",
                        height: "50px",
                        fontSize: "1.5rem",
                        lineHeight: "2rem"
                    },
                    cell: { 
                        width: "50px",
                        height: "75px",
                    },
                    
                }}
                components={{
                    Day: (props) => <Dialog>
                    {
                    props.date.getMonth() === props.displayMonth.getMonth()?
                      <div className="flex  flex-col gap-3 text-2xl">
                           { props.date.getDate()}
                      <div>
                      </div>
                        <div>
                         <DialogTrigger asChild>
                          <Button variant={"ghost"}>
                            {
                              handleProposal(props.date.getDate())
                            }
                          </Button>
                          </DialogTrigger>
                        </div>
                      </div>:
                      <Button disabled={true} variant={"ghost"}>{props.date.getDate()}</Button>
                    }
                      <DialogContent >
                        <DialogHeader>
                            <DialogTitle>Faça sua escolha de proposição para o dia {props.date.getDate()}</DialogTitle>
                            <DialogDescription>
                            <NavigationMenu>
        <NavigationMenuList className="flex w-full justify-evenly py-5">
        {options.map((option) => (<NavigationMenuItem key={generateUniqueKey()}>
            <NavigationMenuTrigger>{option.optionTitle}</NavigationMenuTrigger>
                {option.optionValues.map((optionValue) => (<NavigationMenuContent key={generateUniqueKey()}>

                <Link href={`${proposal&&proposal}${props.date.getDate()}:${optionValue}`} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>{optionValue}</NavigationMenuLink>
                </Link>
            </NavigationMenuContent>))} 
            </NavigationMenuItem>))}
            </NavigationMenuList>
        </NavigationMenu>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                  </Dialog>
                }}
            
            />

        </>
    );
}
