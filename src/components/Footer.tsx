import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { SectionContainer } from "./SectionContainer";
import Link from "next/link";
import { BreadCumbItem } from "@/types";
import { generateRandomKey } from "@/utils";
import styles from "@/components/login.module.css"




interface FooterProps {
  breadCumbs: BreadCumbItem[]
}

export function Footer({ breadCumbs }: FooterProps) {

  return (
    <SectionContainer
      sectionId='Footer'
      bg={"whitesmoke"}
      boxShadow="md"
      borderTopRadius={"2xl"}
      paddingTop={"10"}
    >

      <Breadcrumb
      mt={"auto"}
      w={{lg:"1200px"}}
      separator='-' justifyItems={'center'}>
        {
          breadCumbs.map((breadCumb,i) =>
            <BreadcrumbItem
              key={generateRandomKey(i,5)+breadCumb.href}
              isCurrentPage={breadCumb.isCurrentPage}  >
                {
                  breadCumb.signOut ?
                  //@ts-ignore
                  <div className={`${styles.pointer}`} onClick={()=>breadCumb.signOut()}>{breadCumb.title}</div>
                  :
              <Link href={breadCumb.href}>{breadCumb.title}</Link>
                }
            </BreadcrumbItem>
            )
        }
      </Breadcrumb>
    </SectionContainer>
  )
}