import {createFileRoute} from '@tanstack/react-router'
import * as React from "react";

export const Route = createFileRoute('/_protected/workspace')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <div>My workspace</div>

            <div className="w-[792px] mx-auto grid grid-cols-2 gap-8">
                <div className="w-[390px] h-[260px] border-2 border-[#D9D9D9] rounded-2xl py-4 px-2">
                    <div className={"flex gap-1 items-center"}>
                        <img className={"w-5 h-5"} src={"/Bar Chart.png"} alt={"Bar Chart"}/>
                        <div className={"font-medium"}>Analytics</div>
                    </div>

                    <div className={"flex flex-wrap gap-2 mt-4"}>

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
                                Отчеты
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
                                Аналитика за 2025
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
                                2023
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
                            <p className="truncate">1999
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
                            <p className="truncate">
                                data.xlsx
                            </p>
                        </article>
                    </div>
                </div>

                <div className="w-[390px] h-[260px] border-2 border-[#D9D9D9] rounded-2xl py-4 px-2">
                    <div className={"flex gap-1 items-center"}>
                        <img className={"w-5 h-5"} src={"/Pencil.png"} alt={"Bar Chart"}/>
                        <div className={"font-medium"}>Home Work</div>
                    </div>

                    <div className={"flex flex-wrap gap-2 mt-4"}>

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
                                Отчеты
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
                                Аналитика за 2025
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
                                2023
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
                            <p className="truncate">1999
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
                            <p className="truncate">
                                data.xlsx
                            </p>
                        </article>
                    </div>
                </div>

                <div className="w-[390px] h-[260px] border-2 border-[#D9D9D9] rounded-2xl py-4 px-2">
                    <div className={"flex gap-1 items-center"}>
                        <img className={"w-5 h-5"} src={"/File Folder.png"} alt={"Bar Chart"}/>
                        <div className={"font-medium"}>Работа</div>
                    </div>

                    <div className={"flex flex-wrap gap-2 mt-4"}>

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
                                Отчеты
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
                                Аналитика за 2025
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
                                2023
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
                            <p className="truncate">1999
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
                            <p className="truncate">
                                data.xlsx
                            </p>
                        </article>
                    </div>
                </div>

                <div className="w-[390px] h-[260px] border-2 border-[#D9D9D9] rounded-2xl py-4 px-2">
                    <div className={"flex gap-1 items-center"}>
                        <img className={"w-5 h-5"} src={"/Film Frames" +
                            ".png"} alt={"Bar Chart"}/>
                        <div className={"font-medium"}>Хобби</div>
                    </div>

                    <div className={"flex flex-wrap gap-2 mt-4"}>

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
                                Отчеты
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
                                Аналитика за 2025
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
                                2023
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
                            <p className="truncate">1999
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
                            <p className="truncate">
                                data.xlsx
                            </p>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    )
}
