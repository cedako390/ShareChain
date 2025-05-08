import {createFileRoute} from '@tanstack/react-router'
import FileExplorer from "@/components/Filter/FileExplorer.tsx";
import * as React from "react";

export const Route = createFileRoute('/_protected/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [activeView, setActiveView] = React.useState<"grid" | "list">("grid");

    return <div className="max-w-[900px] w-full mx-auto px-4">
        <div className="font-medium text-[14px] mt-10 mb-8">
            Последние взаимодействия
        </div>

        <div className="flex flex-wrap gap-4">
            <article

                className={`flex flex-col justify-center px-2 pt-5 pb-4 text-sm font-medium tracking-normal leading-none text-center rounded-lg bg-[#F6F9FF] w-[180px] text-zinc-900`}
            >
                <figure className="mb-3.5">
                    <img
                        src={"/folder.png"}
                        alt={"text"}
                        className="object-contain self-center aspect-[1.25] w-[65px] mx-auto"
                    />
                </figure>
                <p className="flex-1 shrink gap-7 self-stretch mt-3.5 w-full basis-0">
                    Документы
                </p>
            </article>
            <article
                className={`flex flex-col justify-center px-2 pt-5 pb-4 text-sm font-medium tracking-normal leading-none text-center rounded-lg bg-[#F6F9FF] w-[180px] text-zinc-900`}
            >
                <figure className="mb-3.5">
                    <img
                        src={"/docx.png"}
                        alt={"text"}
                        className="object-contain self-center aspect-[1.25] w-[65px] mx-auto"
                    />
                </figure>
                <p className="flex-1 shrink gap-7 self-stretch mt-3.5 w-full basis-0">
                    димломка-1.docx
                </p>
            </article>
            <article
                className={`flex flex-col justify-center px-2 pt-5 pb-4 text-sm font-medium tracking-normal leading-none text-center rounded-lg bg-[#F6F9FF] w-[180px] text-zinc-900`}
            >
                <figure className="mb-3.5">
                    <img
                        src={"/folder.png"}
                        alt={"text"}
                        className="object-contain self-center aspect-[1.25] mx-auto"
                    />
                </figure>
                <p className="flex-1 shrink gap-7 self-stretch mt-3.5 w-full basis-0">
                    Домашняя работа
                </p>
            </article>
            <article
                className={`flex flex-col justify-center px-2 pt-5 pb-4 text-sm font-medium tracking-normal leading-none text-center rounded-lg bg-[#F6F9FF] w-[180px] text-zinc-900`}
            >
                <figure className="mb-3.5">
                    <img
                        src={"/xlsx.png"}
                        alt={"text"}
                        className="object-contain self-center aspect-[1.25] w-[65px] mx-auto"
                    />
                </figure>
                <p className="flex-1 shrink gap-7 self-stretch mt-3.5 w-full basis-0 truncate">
                    Отчет за 01.01.2025.xslx
                </p>
            </article>
        </div>

        <FileExplorer activeView={activeView} setActiveView={setActiveView}/>
        {
            activeView === "grid" && (
                <div className={"grid grid-cols-4 gap-6"}>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="truncate">
                            Документы
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="truncate">
                            Важные файлы и папки
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="truncate">
                            Домашняя работа
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/xlsx.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            Отчет.xlsx
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/docx.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="truncate">
                            Курсовая работа.docx
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[180px] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/docx.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="truncate">
                            main.docx
                        </p>
                    </article>
                </div>
            )
        }
        {
            activeView === "list" && (
                <div className={"flex flex-col gap-3"}>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            Документы
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            Важные файлы
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/folder.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            {"text"}
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/xlsx.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            Отчеты за неделю.xlsx
                        </p>
                    </article>
                    <article
                        className={`flex flex-row px-3 py-2 text-sm font-medium text-center rounded-lg items-center gap-2 bg-[#F6F9FF] w-[100%] h-10 text-zinc-900`}
                    >
                        <figure className="">
                            <img
                                src={"/docx.png"}
                                alt={"text"}
                                className="w-6 h-6 object-contain self-center aspect-[1.25] mx-auto"
                            />
                        </figure>
                        <p className="">
                            main.docx
                        </p>
                    </article>
                </div>
            )
        }
    </div>
}
