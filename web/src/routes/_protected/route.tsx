import { Header } from "@/components/Header/Header.tsx";
import { NavbarButton } from "@/components/NavbarButton/NavbarButton.tsx";
import {
	HomeIcon,
	MagnifyingGlassIcon,
	Squares2X2Icon,
} from "@heroicons/react/16/solid";
import { AppShell } from "@mantine/core";
import { Spotlight, spotlight } from "@mantine/spotlight";
import {createFileRoute, Outlet, useLocation} from "@tanstack/react-router";
import styles from "./route.module.scss";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
});
const actions = [
	{
		id: "home",
		label: "Home",
		description: "Get to home page",
		onClick: () => console.log("Home"),
		leftSection: <HomeIcon />,
	},
	{
		id: "dashboard",
		label: "Dashboard",
		description: "Get full information about current system status",
		onClick: () => console.log("Dashboard"),
		leftSection: <HomeIcon />,
	},
	{
		id: "documentation",
		label: "Documentation",
		description: "Visit documentation to lean more about all features",
		onClick: () => console.log("Documentation"),
		leftSection: <HomeIcon />,
	},
];

function RouteComponent() {
	const location = useLocation();

	return (
		<AppShell navbar={{ width: 256, breakpoint: "sm" }} padding="md">
			<AppShell.Navbar p="md" className={styles.navbar}>
				<NavbarButton
					icon={<HomeIcon />}
					label="Home"
					to="/"
					active={location.pathname === "/"}
				/>
				<NavbarButton
					icon={<Squares2X2Icon />}
					label="Workspace"
					to="/workspace"
					active={location.pathname === "/workspace"}
				/>
				<NavbarButton
					icon={<MagnifyingGlassIcon />}
					label="Search"
					onClick={spotlight.open}
				/>
			</AppShell.Navbar>
			<AppShell.Main className={styles.main}>
				<Header />
				<Outlet/>
			</AppShell.Main>

			<Spotlight
				actions={actions}
				nothingFound="Nothing found..."
				highlightQuery
				searchProps={{
					leftSection: (
						<MagnifyingGlassIcon style={{ width: 24, height: 24 }} />
					),
					placeholder: "Search...",
				}}
			/>
		</AppShell>
	);
}
