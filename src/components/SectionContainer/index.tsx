import { Container, ContainerProps } from "@chakra-ui/react";
import { ReactNode } from "react";


interface SectionContainerProps extends ContainerProps{
  sectionId:string
  children: ReactNode
}

export function SectionContainer ({sectionId,children, ...props}:SectionContainerProps) {
  return (
        <section id={`#${sectionId}`} >
        <Container paddingX={5} paddingY={3} {...props} w={{lg:"fit-content"}} maxW={"1200px"} mx={"auto"}>
          {children}
        </Container>
        </section>

  )

}