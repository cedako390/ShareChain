import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/dropzone/styles.css"
import "@mantine/notifications/styles.css"
import "@mantine/spotlight/styles.css"
import "@mantine/tiptap/styles.css"

export const Route = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
});
