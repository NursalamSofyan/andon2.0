import { ReactNode } from "react"
const MaxWidthWrapper = ({
    className,
    children
} : {
    className?: string,
    children: ReactNode
}) => {
  return (
    <div className={`mx-auto w-full max-w-8xl px-2.5 md:px-2 ${className}`}>
        {children}
    </div>
  )
}

export default MaxWidthWrapper