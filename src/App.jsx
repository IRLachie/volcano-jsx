import NavBar from "./NavBar";
import { Box } from "@chakra-ui/react";
import bgimage1 from "./bgimage1.jpg";

import "./styles.css";

export default function App() {
	localStorage.setItem("loggedin", "false");

	return (
		<>
			<NavBar />
			<Box minHeight="100vh" backgroundImage={bgimage1} backgroundRepeat="no-repeat" backgroundSize="cover" />
		</>
	);
}
