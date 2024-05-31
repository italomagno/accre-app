
import image from "@/assets/s-widua-3YAIvBNlZM4-unsplash.jpg"
import { Button } from "@/components/ui/button"
import styles from "@/components/login.module.css"
import Image from "next/image"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { createStandaloneToast } from "@chakra-ui/react"
interface LoginComponentProps{
  children: React.ReactNode
}

export function LoginComponent({children}:LoginComponentProps) {
  const { ToastContainer } = createStandaloneToast();
    return (
      <div className={`${styles.loginContainer}`}>
        <ToastContainer/>
        <div className={`${styles.heroContainer}`}>
          <Image
            alt="Authentication Hero"
            className={` ${styles.heroImage}`}
            height="800"
            src={image}
            style={{
              aspectRatio: "1200/800",
              objectFit: "cover",
            }}
            width="600"
          />
          <div className={`${styles.gradientOverlay}`} />
          <div className={`${styles.heroContent}`}>
            <div className={`${styles.heroBox}`}>
              <h1 className={`${styles.heroTitle}`}>
                Shift App
              </h1>
              <p className={`${styles.heroSubtitle}`}>
                Solução de turnos para controladores de voo.
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.formContainer}`}>
          <div className={`${styles.formBox1}`}>
            <div className={`${styles.formBox2}`}>
              {/* <h2 className={`${styles.formTitle}`}>Sign in to your account</h2> */}
              <p className={` ${styles.formSubtitle}`}>
                Faça seu login no app.
              </p>
            </div>
              {children}
            {/* <form className={`${styles.formStyle}`}>
              <div>
                <Label className={`${styles.Label}`} htmlFor="password">Password</Label>
                <Input className={`${styles.Input}`} id="password" required type="password" />
              </div>
              <Button className={styles.Button}  variant="outline" type="submit">
                Login
              </Button>
            </form> */}
           {/*  <div className={`${styles.Relative}`}>
              <div className={`${styles.div1}`}>
                <span className={`${styles.borderW}`} />
              </div>
              <div className={`${styles.textBoxStyle}`}>
                <span className={`${styles.spamStyle}`}>Or continue with</span>
              </div>
            </div> */}
           {/*  <div className={styles.IconBox1}>
              <Button variant="outline">
                <GithubIcon className={`${styles.IconStyles1}`} />
                Github
              </Button>
              <Button variant="outline">
                <ChromeIcon className={`${styles.IconStyles1}`} />
                Google
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    )
  }

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  )
}


function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}
