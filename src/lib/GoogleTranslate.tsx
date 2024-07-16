"use client";
import Script from "next/script";
import React, { useEffect } from "react";
import Image from "next/image";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/src/components/ui/select";
import { generateUniqueKey } from "./utils";

const languages = [
{ label: "Portuguese", value: "pt", src: "https://flagcdn.com/h60/br.png" },
  { label: "English", value: "en", src: "https://flagcdn.com/h60/us.png" },
  { label: "German", value: "de", src: "https://flagcdn.com/h60/de.png" },
  { label: "French", value: "fr", src: "https://flagcdn.com/h60/fr.png" },
      // Add additional languages as needed
];
type LenguageProps = typeof languages[0]

const includedLanguages = languages.map(lang => lang.value).join(",");

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

function googleTranslateElementInit() {
  (new (window as any).google.translate.TranslateElement)({
    pageLanguage: "auto", includedLanguages
  }, "google_translate_element");
}

export function GoogleTranslate({ prefLangCookie,HandlePrefLangCookie }: { prefLangCookie: string, HandlePrefLangCookie?:(lang:string)=>Promise<void> }) {
  const [langCookie, setLangCookie] = React.useState(prefLangCookie);
  const [selectedLanguage,setSelectedLanguage] = React.useState<LenguageProps>(languages[0]);

  useEffect(() => {
    window.googleTranslateElementInit = googleTranslateElementInit;
    const iframe = document.querySelector("iframe");
    if (iframe) {
        iframe.style.visibility = "hidden";
    }
    const handleScriptLoad = () => {
      googleTranslateElementInit();
      const initialLanguage = langCookie.replace(/\//g, '');
      setLangCookie(langCookie);
      const language = languages.find(language => language.value === initialLanguage);
      if (language) setSelectedLanguage(language);
      const element = document.querySelector(".goog-te-combo") as HTMLSelectElement;
      if (element) {
        element.value = initialLanguage;
        element.dispatchEvent(new Event("change"));
      }
    };},[]);
      React.useEffect(() => {
    const intervalId = setInterval(() => {
      const element = document.querySelector(".goog-te-combo") as HTMLSelectElement;
     
      if (element && element.value !== langCookie.split("/")[1]) {
        const selectedLang = element.value;
        const language = languages.find(lang => lang.value === selectedLang);
        if (language) {
          setSelectedLanguage(language);
          setLangCookie(`/${selectedLang}/`);
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [langCookie]);

  const onChange = (value: string) => {
    const language = languages.find(language=>language.value === value)
    if(language) setSelectedLanguage(language)
    const lang = `/${value}/`;

    HandlePrefLangCookie && HandlePrefLangCookie(lang)
    setLangCookie(lang);
    const element = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if(element) {
        element.value = value;
        element.dispatchEvent(new Event("change"));
      }

    const iframe = document.querySelector("iframe");
    if (iframe) {
        iframe.style.visibility = "hidden";
    }
    
  };

  return (
    <div>
      <div id="google_translate_element" style={{ visibility: "hidden", width: "1px", height: "1px" }}></div>
      <LanguageSelector onChange={onChange} value={langCookie} selectedLanguage={selectedLanguage} />
      <Script
      style={{ visibility: "hidden", width: "1px", height: "1px" }}
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
};

function LanguageSelector({ onChange, value ,selectedLanguage}: { onChange: (value: string) => void; value: string, selectedLanguage:LenguageProps }) {
  return (
    <div className="flex items-center gap-2">
        <Select
                            onValueChange={(e)=>onChange(e)}
                            defaultValue={selectedLanguage.value ?? "pt"}
                            value={selectedLanguage.value ?? "pt"}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>

                              {languages.map((lang) => (
                                <SelectItem
                                  key={generateUniqueKey()}
                                  value={lang.value}
                                >
                                    <Image
                                      src={lang.src}
                                      alt={lang.value}
                                      width={16}
                                      height={16}
                                      />
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
     
    </div>
    
  );
}