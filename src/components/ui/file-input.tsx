import { SVGProps } from "react"

export function FileInput() {
  //ToDo: Implement file upload
  //ToDo: Implement file validation
  //ToDo: Implement file parsing
  //ToDo: Implement file error handling
  //ToDo: Implement file success handling
  //ToDo: Implement file loading state
  return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-4">
          <div className="flex flex-col items-center justify-center w-full px-6 py-10 border-2 border-dashed border-primary rounded-md bg-background hover:bg-muted transition-colors relative pointer-events-none">
              <UploadIcon className="w-10 h-10 text-primary" />
              <h3 className="mt-4 text-lg font-medium">Faça o upload do arquivo .csv</h3>
              <p className="mt-2 text-sm text-muted-foreground">Arraste e solte o arquivo ou clique para seleciona-lo</p>
              <input type="file" accept=".csv" className="absolute inset-0 w-full h-full cursor-pointer pointer-events-auto" />
          </div>
          <p className="text-sm text-muted-foreground">Apenas arquivos .csv são aceitos. Tamanho máximo do arquivo é: 5MB.</p>
      </div>
  )
}

function UploadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
