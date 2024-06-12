import { Skeleton } from "../components/ui/skeleton";

export function LoadingSkeleton(){
        return (
                <>
                <Skeleton className="h-16 w-dvw p-4" />
                <div className="grid w-dvw h-dvh gap-5 lg:grid-cols-[240px_1fr] p-4">
                <div className="flex flex-col p-4 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                </div>

                    <div className="flex flex-wrap gap-5">
                        <Skeleton className="h-96 w-[250px]" />
                        <Skeleton className="h-96 w-[200px]" />
                        <Skeleton className="h-96 w-[250px]" />
                        <Skeleton className="h-96 w-[200px]" />
                    </div>
                    
                    
            </div>
            </>
          )
}