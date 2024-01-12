import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col w-full gap-3">
    {[...Array(5).keys()].map((_,i)=>(
      <div 
        className={`flex flex-col justify-around max-h-[108px] h-[100px] w-full max-w-xl min-h-[100px] rounded-[.5em] border p-2 gap-2 border-gray-500/10`} 
        style={{ opacity: 1 - i * 0.2 }}
        key={`loading-key-num-${i}`}>
        <div className="flex flex-row w-full gap-2 h-full">
          <Skeleton className="h-full w-full " />
          <Skeleton className="h-full w-1/2 " />
        </div>
        <div className="flex flex-row w-full gap-2 h-full">
          <Skeleton className="h-full w-full " />
          <Skeleton className="h-full w-1/6 " />
        </div>
      </div>
    ))}
    </div>
  )
}