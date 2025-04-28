import { createFileRoute } from '@tanstack/react-router'
import FilesContainer from "@/componets/FilesContainer/FilesContainer.tsx";
import FileFolderItem from "@/componets/FileFolderItem/FileFolderItem.tsx";

export const Route = createFileRoute('/_protected/')({
  component: RouteComponent,
})

const items = [
  { id: 1, name: 'main.docx', variant: 'small' as const },
  { id: 2, name: 'main.docx', variant: 'small' as const },
  { id: 3, name: 'main.docx', variant: 'small' as const },
  { id: 4, name: 'main.docx', variant: 'small' as const },
  { id: 5, name: 'main.docx', variant: 'small' as const },
  { id: 6, name: 'report.pdf', variant: 'normal' as const },
  { id: 7, name: 'presentation.pptx', variant: 'large' as const },
];

function RouteComponent() {
  return <div>
    hello
    <FilesContainer>
      {items.map(item => (
        <FileFolderItem
          key={item.id}
          name={item.name}
          variant={item.variant}
        />
      ))}
    </FilesContainer>
  </div>
}
